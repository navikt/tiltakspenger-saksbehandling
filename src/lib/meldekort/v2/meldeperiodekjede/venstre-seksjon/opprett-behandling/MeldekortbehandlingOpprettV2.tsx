import { Alert, Button, Loader, InlineMessage, BodyShort, VStack } from '@navikt/ds-react';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { useRef } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { MeldekortbehandlingType } from '~/lib/meldekort/typer/Meldekortbehandling';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { useMeldeperiodeKjedeV2 } from '~/lib/meldekort/v2/meldeperiodekjede/context/MeldeperiodeKjedeContextV2';
import { useOpprettMeldekortbehandlingV2 } from '~/lib/meldekort/v2/meldeperiodekjede/venstre-seksjon/opprett-behandling/useOpprettMeldekortbehandlingV2';
import { InternLenke } from '~/lib/_felles/intern-lenke/InternLenke';
import { useRouter } from 'next/router';

import style from './MeldekortbehandlingOpprettV2.module.css';

type Props = {
    type: MeldekortbehandlingType;
};

export const MeldekortbehandlingOpprettV2 = ({ type }: Props) => {
    const { sakId, saksnummer, åpenMeldekortbehandlingId } = useSak().sak;
    const { id: kjedeId } = useMeldeperiodeKjedeV2().meldeperiodeKjede;

    const { opprett, laster, feil } = useOpprettMeldekortbehandlingV2({
        kjedeId,
        sakId,
        type,
    });

    const router = useRouter();

    const modalRef = useRef<HTMLDialogElement>(null);

    const tekster = teksterForType[type];

    const lukkModal = () => modalRef.current?.close();

    return (
        <VStack gap={'space-16'}>
            {feil && (
                <Alert variant={'error'} className={style.varsel}>
                    {feil.message}
                </Alert>
            )}

            {åpenMeldekortbehandlingId && (
                <InlineMessage status={'info'}>
                    <BodyShort spacing={true}>{'Saken har en åpen meldekortbehandling'}</BodyShort>
                    <InternLenke
                        href={meldekortbehandlingUrl(saksnummer, åpenMeldekortbehandlingId)}
                    >
                        {'Til behandlingen'}
                    </InternLenke>
                </InlineMessage>
            )}

            <Button
                disabled={!!åpenMeldekortbehandlingId}
                onClick={() => modalRef.current?.showModal()}
                className={style.knapp}
            >
                {tekster.start}
            </Button>

            <BekreftelsesModal
                modalRef={modalRef}
                tittel={tekster.modalTittel}
                feil={feil}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        icon={laster && <Loader />}
                        disabled={laster}
                        onClick={() => {
                            opprett().then((meldekortbehandling) => {
                                if (meldekortbehandling) {
                                    lukkModal();
                                    router.push(
                                        meldekortbehandlingUrl(saksnummer, meldekortbehandling.id),
                                    );
                                }
                            });
                        }}
                    >
                        {tekster.start}
                    </Button>
                }
            >
                {tekster.modalTekst}
            </BekreftelsesModal>
        </VStack>
    );
};

const teksterForType = {
    [MeldekortbehandlingType.FØRSTE_BEHANDLING]: {
        start: 'Start behandling',
        kanIkkeStarte: 'Kan ikke starte behandling av meldekortet',
        modalTittel: 'Start behandling av meldekortet',
        modalTekst: 'Vil du starte behandling av dette meldekortet?',
    },
    [MeldekortbehandlingType.KORRIGERING]: {
        start: 'Start korrigering',
        kanIkkeStarte: 'Kan ikke starte korrigering av meldekortet',
        modalTittel: 'Start korrigering av meldekortet',
        modalTekst: 'Vil du starte korrigering av dette meldekortet?',
    },
} as const satisfies Record<MeldekortbehandlingType, Record<string, string>>;
