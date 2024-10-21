import { Button } from '@navikt/ds-react';
import router from 'next/router';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { finnLenke } from '../../hooks/useTaBehandling';

export const knappForBehandlingType = (
  status: BehandlingStatus,
  behandlingId: string,
  eierBehandling: boolean,
  skalKunneTaBehandling: boolean,
  onOpprettBehandling: ({ id }) => void,
  onTaBehandling: ({ id }) => void,
) => {
  switch (status) {
    case BehandlingStatus.SØKNAD:
      return (
        <Button
          style={{ minWidth: '50%' }}
          size="small"
          variant={'primary'}
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
            onClick={() => router.push(finnLenke(behandlingId, status))}
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
