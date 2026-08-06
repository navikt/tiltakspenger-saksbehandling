import { Button, Dialog, Loader, VStack } from '@navikt/ds-react';
import { useState } from 'react';
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

    const [åpen, settÅpen] = useState<boolean>(false);

    const type =
        meldekortbehandlingIder.length === 0
            ? MeldeperiodebehandlingType.FØRSTE_BEHANDLING
            : MeldeperiodebehandlingType.KORRIGERING;

    const tekster = teksterForType[type];

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

            <Dialog open={åpen} onOpenChange={settÅpen}>
                <Dialog.Trigger>
                    <Button
                        disabled={!kanBehandleMeldeperiodekjede(meldeperiodeKjede)}
                        className={style.knapp}
                    >
                        {tekster.start}
                    </Button>
                </Dialog.Trigger>

                <Dialog.Popup>
                    <Dialog.Header>
                        <Dialog.Title>{tekster.modalTittel}</Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
                        <VStack gap={'space-16'}>
                            {tekster.modalTekst}

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
                                opprettMeldekortbehandling({ kjedeIder: [kjedeId] }).then(
                                    (meldekortbehandling) => {
                                        if (meldekortbehandling) {
                                            settÅpen(false);
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
