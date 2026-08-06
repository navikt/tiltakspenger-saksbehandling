import { BodyShort, Button, Dialog, Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useSak } from '~/lib/sak/SakContext';
import { useSaksbehandler } from '~/lib/saksbehandler/SaksbehandlerContext';
import { erSaksbehandler } from '~/lib/saksbehandler/tilganger';
import { finnUbehandledeMeldekort } from '~/lib/meldekort/utils/meldekortbehandlingUtils';
import { useOpprettMeldekortbehandling } from '~/lib/meldekort/utils/useOpprettMeldekortbehandling';
import { brukersMeldekortInnsendingstypeTekst } from '~/lib/meldekort/utils/meldekortTekster';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { formaterMeldeperiode } from '~/utils/date';
import { ComponentProps, useState } from 'react';

import style from './OpprettForUbehandledeMeldekort.module.css';

type Props = {
    size?: ComponentProps<typeof Button>['size'];
};

export const OpprettForUbehandledeMeldekort = ({ size }: Props) => {
    const { sakId, saksnummer, meldeperiodeKjeder } = useSak().sak;
    const { innloggetSaksbehandler } = useSaksbehandler();
    const router = useRouter();

    const [åpen, settÅpen] = useState<boolean>(false);

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

    return (
        <VStack align={'start'}>
            <Dialog open={åpen} onOpenChange={settÅpen}>
                <Dialog.Trigger>
                    <Button size={size} variant={'secondary'}>
                        {'Opprett behandling'}
                    </Button>
                </Dialog.Trigger>

                <Dialog.Popup>
                    <Dialog.Header>
                        <Dialog.Title>{'Opprett behandling av meldekort'}</Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
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

                            {opprettMeldekortbehandlingError && (
                                <Infokort variant={'feil'} size={'small'}>
                                    {opprettMeldekortbehandlingError.message}
                                </Infokort>
                            )}
                        </VStack>
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button
                            type={'button'}
                            icon={opprettMeldekortbehandlingLaster && <Loader />}
                            disabled={opprettMeldekortbehandlingLaster}
                            onClick={() => {
                                opprettMeldekortbehandling({
                                    kjedeIder: sortertMeldekort.map((kjede) => kjede.id),
                                }).then((meldekortbehandling) => {
                                    if (meldekortbehandling) {
                                        settÅpen(false);
                                        router.push(
                                            meldekortbehandlingUrl(
                                                saksnummer,
                                                meldekortbehandling.id,
                                            ),
                                        );
                                    }
                                });
                            }}
                        >
                            {'Opprett behandling'}
                        </Button>

                        <Dialog.CloseTrigger>
                            <Button variant={'secondary'} type={'button'}>
                                {'Avbryt'}
                            </Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Footer>
                </Dialog.Popup>
            </Dialog>
        </VStack>
    );
};
