import { Button, Loader, VStack } from '@navikt/ds-react';
import { BekreftelsesModal } from '~/lib/_felles/modaler/BekreftelsesModal';
import { useRef } from 'react';
import { useSak } from '~/lib/sak/SakContext';
import { MeldeperiodebehandlingType } from '~/lib/meldekort/typer/Meldekortbehandling';
import { meldekortbehandlingUrl } from '~/utils/urls';
import { useMeldeperiodekjede } from '~/lib/meldekort/meldeperiodekjede/context/MeldeperiodekjedeContext';
import { useRouter } from 'next/router';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { useOpprettMeldekortbehandling } from '~/lib/meldekort/utils/useOpprettMeldekortbehandling';
import { kanIkkeBehandlesGrunnTekst } from '~/lib/meldekort/utils/tekster';
import { kanBehandleMeldeperiodekjede } from '~/lib/meldekort/utils/meldekortbehandlingUtils';

import style from './MeldekortbehandlingOpprett.module.css';

export const MeldekortbehandlingOpprett = () => {
    const { sakId, saksnummer } = useSak().sak;
    const { meldeperiodeKjede } = useMeldeperiodekjede();
    const { id: kjedeId, meldekortbehandlingIder, kanIkkeBehandlesGrunn } = meldeperiodeKjede;

    const {
        opprettMeldekortbehandling,
        opprettMeldekortbehandlingLaster,
        opprettMeldekortbehandlingError,
    } = useOpprettMeldekortbehandling(sakId);

    const router = useRouter();

    const modalRef = useRef<HTMLDialogElement>(null);

    const type =
        meldekortbehandlingIder.length === 0
            ? MeldeperiodebehandlingType.FØRSTE_BEHANDLING
            : MeldeperiodebehandlingType.KORRIGERING;

    const tekster = teksterForType[type];

    const lukkModal = () => modalRef.current?.close();

    return (
        <VStack gap={'space-16'}>
            {opprettMeldekortbehandlingError && (
                <Infokort variant={'feil'} size={'small'}>
                    {opprettMeldekortbehandlingError.message}
                </Infokort>
            )}

            {kanIkkeBehandlesGrunn && (
                <Infokort variant={'advarsel'} header={tekster.kanIkkeStarte} size={'small'}>
                    {kanIkkeBehandlesGrunnTekst[kanIkkeBehandlesGrunn]}
                </Infokort>
            )}

            <Button
                disabled={!kanBehandleMeldeperiodekjede(meldeperiodeKjede)}
                onClick={() => modalRef.current?.showModal()}
                className={style.knapp}
            >
                {tekster.start}
            </Button>

            <BekreftelsesModal
                modalRef={modalRef}
                tittel={tekster.modalTittel}
                feil={opprettMeldekortbehandlingError}
                lukkModal={lukkModal}
                bekreftKnapp={
                    <Button
                        icon={opprettMeldekortbehandlingLaster && <Loader />}
                        disabled={opprettMeldekortbehandlingLaster}
                        onClick={() => {
                            opprettMeldekortbehandling({ kjedeIder: [kjedeId] }).then(
                                (meldekortbehandling) => {
                                    if (meldekortbehandling) {
                                        lukkModal();
                                        router.push(
                                            meldekortbehandlingUrl(
                                                saksnummer,
                                                meldekortbehandling.id,
                                            ),
                                        );
                                    }
                                },
                            );
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

const teksterForType: Record<MeldeperiodebehandlingType, Record<string, string>> = {
    [MeldeperiodebehandlingType.FØRSTE_BEHANDLING]: {
        start: 'Start behandling',
        kanIkkeStarte: 'Kan ikke starte behandling av meldekortet',
        modalTittel: 'Start behandling av meldekortet',
        modalTekst: 'Vil du starte behandling av dette meldekortet?',
    },
    [MeldeperiodebehandlingType.KORRIGERING]: {
        start: 'Start korrigering',
        kanIkkeStarte: 'Kan ikke starte korrigering av meldekortet',
        modalTittel: 'Start korrigering av meldekortet',
        modalTekst: 'Vil du starte korrigering av dette meldekortet?',
    },
} as const;
