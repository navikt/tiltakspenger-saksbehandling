import { BodyShort, Button, Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useSak } from '~/lib/sak/SakContext';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { erSaksbehandler } from '~/lib/saksbehandler/tilganger';
import { finnUbehandledeMeldekort } from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { useOpprettMeldekortbehandling } from '~/lib/meldekort/utils/useOpprettMeldekortbehandling';
import { brukersMeldekortInnsendingstypeTekst } from '~/lib/meldekort/utils/tekster';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { formaterMeldeperiode } from '~/utils/date';
import { ComponentProps, useRef } from 'react';

import style from './OpprettForUbehandledeMeldekort.module.css';

type Props = {
    size?: ComponentProps<typeof Button>['size'];
};

export const OpprettForUbehandledeMeldekort = ({ size }: Props) => {
    const { sakId, saksnummer, meldeperiodeKjeder } = useSak().sak;
    const { innloggetSaksbehandler } = useSaksbehandler();
    const router = useRouter();

    const modalRef = useRef<HTMLDialogElement>(null);

    const {
        opprettMeldekortbehandling,
        opprettMeldekortbehandlingLaster,
        opprettMeldekortbehandlingError,
    } = useOpprettMeldekortbehandling(sakId);

    const ubehandledeMeldekort = finnUbehandledeMeldekort(meldeperiodeKjeder);

    if (ubehandledeMeldekort.length === 0 || !erSaksbehandler(innloggetSaksbehandler)) {
        return null;
    }

    const antall = ubehandledeMeldekort.length;

    const sortertMeldekort = ubehandledeMeldekort.toSorted((a, b) =>
        a.periode.fraOgMed < b.periode.fraOgMed ? -1 : 1,
    );

    const lukkModal = () => modalRef.current?.close();

    return (
        <VStack align={'start'}>
            <Button size={size} variant={'secondary'} onClick={() => modalRef.current?.showModal()}>
                {'Opprett behandling'}
            </Button>

            <BekreftelsesModal
                modalRef={modalRef}
                tittel={'Opprett behandling av meldekort'}
                feil={opprettMeldekortbehandlingError}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        icon={opprettMeldekortbehandlingLaster && <Loader />}
                        disabled={opprettMeldekortbehandlingLaster}
                        onClick={() => {
                            opprettMeldekortbehandling({
                                kjedeIder: sortertMeldekort.map((kjede) => kjede.id),
                            }).then((meldekortbehandling) => {
                                if (meldekortbehandling) {
                                    lukkModal();
                                    router.push(
                                        meldekortbehandlingUrl(saksnummer, meldekortbehandling.id),
                                    );
                                }
                            });
                        }}
                    >
                        {'Opprett behandling'}
                    </Button>
                }
            >
                <VStack gap={'space-8'}>
                    <BodyShort>
                        {`Meldeperiodene til følgende ${antall > 1 ? `${antall} ` : ''}meldekort blir inkludert i behandlingen:`}
                    </BodyShort>

                    <VStack as={'ul'} gap={'space-4'} className={style.liste}>
                        {sortertMeldekort.map((kjede) => (
                            <BodyShort as={'li'} key={kjede.id}>
                                {`${formaterMeldeperiode(kjede.periode)} - ${brukersMeldekortInnsendingstypeTekst(kjede.brukersMeldekortStatus)}`}
                            </BodyShort>
                        ))}
                    </VStack>

                    <BodyShort>
                        {
                            'Du kan legge til eller fjerne meldeperioder fra behandlingen etter at den er opprettet.'
                        }
                    </BodyShort>
                </VStack>
            </BekreftelsesModal>
        </VStack>
    );
};
