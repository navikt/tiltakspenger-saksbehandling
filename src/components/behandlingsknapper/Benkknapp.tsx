import { Button } from '@navikt/ds-react';
import router from 'next/router';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { finnBehandlingslenke } from '../../hooks/useTaBehandling';

export const knappForBehandlingType = (
    status: BehandlingStatus,
    behandlingId: string,
    eierBehandling: boolean,
    skalKunneTaBehandling: boolean,
    onOpprettBehandling: ({ id }) => void,
    onTaBehandling: ({ id }) => void,
    opprettloading: boolean,
    tildelLoading: boolean,
) => {
    switch (status) {
        case BehandlingStatus.SØKNAD:
            return (
                <Button
                    style={{ minWidth: '50%' }}
                    size="small"
                    variant={'primary'}
                    loading={opprettloading}
                    onClick={() => onOpprettBehandling({ id: behandlingId })}
                >
                    Opprett behandling
                </Button>
            );
        case BehandlingStatus.UNDER_BEHANDLING:
        case BehandlingStatus.UNDER_BESLUTNING:
            if (eierBehandling) {
                return (
                    <Button
                        style={{ minWidth: '50%' }}
                        size="small"
                        variant={'secondary'}
                        onClick={() => router.push(finnBehandlingslenke(behandlingId, status))}
                    >
                        Fortsett
                    </Button>
                );
            }
        case BehandlingStatus.KLAR_TIL_BEHANDLING:
        case BehandlingStatus.KLAR_TIL_BESLUTNING:
            if (skalKunneTaBehandling) {
                return (
                    <Button
                        style={{ minWidth: '50%' }}
                        size="small"
                        variant={'primary'}
                        loading={tildelLoading}
                        onClick={() => onTaBehandling({ id: behandlingId })}
                    >
                        Tildel meg
                    </Button>
                );
            }
        default:
            return null;
    }
};
