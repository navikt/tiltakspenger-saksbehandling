import { Button } from '@navikt/ds-react';
import router from 'next/router';
import { BehandlingForBenk, BehandlingStatus } from '../../types/BehandlingTypes';
import { finnBehandlingslenke, useTaBehandling } from '../../hooks/useTaBehandling';
import { useSaksbehandler } from '../../hooks/useSaksbehandler';
import { useOpprettBehandling } from '../../hooks/useOpprettBehandling';
import { eierBehandling, skalKunneTaBehandling } from '../../utils/tilganger';

type Props = {
    behandling: BehandlingForBenk;
};

export const BehandlingKnappForBenk = ({ behandling }: Props) => {
    const { innloggetSaksbehandler } = useSaksbehandler();
    const { onTaBehandling, isBehandlingMutating } = useTaBehandling();
    const { onOpprettBehandling, isSøknadMutating } = useOpprettBehandling();

    const { status, id, saksbehandler, beslutter } = behandling;

    switch (status) {
        case BehandlingStatus.SØKNAD: {
            return (
                <Button
                    style={{ minWidth: '50%' }}
                    size="small"
                    variant={'primary'}
                    loading={isSøknadMutating}
                    onClick={() => onOpprettBehandling({ id })}
                >
                    {'Opprett behandling'}
                </Button>
            );
        }
        case BehandlingStatus.UNDER_BEHANDLING:
        case BehandlingStatus.UNDER_BESLUTNING: {
            if (!eierBehandling(status, innloggetSaksbehandler, saksbehandler, beslutter)) {
                break;
            }

            return (
                <Button
                    style={{ minWidth: '50%' }}
                    size="small"
                    variant={'secondary'}
                    onClick={() => router.push(finnBehandlingslenke(id, status))}
                >
                    Fortsett
                </Button>
            );
        }
        case BehandlingStatus.KLAR_TIL_BEHANDLING:
        case BehandlingStatus.KLAR_TIL_BESLUTNING: {
            if (!skalKunneTaBehandling(status, innloggetSaksbehandler, saksbehandler)) {
                break;
            }

            return (
                <Button
                    style={{ minWidth: '50%' }}
                    size="small"
                    variant={'primary'}
                    loading={isBehandlingMutating}
                    onClick={() => onTaBehandling({ id })}
                >
                    Tildel meg
                </Button>
            );
        }
    }

    return null;
};
