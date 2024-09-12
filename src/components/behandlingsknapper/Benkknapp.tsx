import { Button } from '@navikt/ds-react';
import router from 'next/router';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { eierBehandling, skalKunneTaBehandling } from '../../utils/tilganger';
import { useOpprettBehandling } from '../../hooks/useOpprettBehandling';
import { useTaBehandling } from '../../hooks/useTaBehandling';
import { useContext } from 'react';
import { SaksbehandlerContext } from '../../pages/_app';

const finnLenke = (behandlingId: string, status: BehandlingStatus) => {
  switch (status) {
    case BehandlingStatus.KLAR_TIL_BEHANDLING:
    case BehandlingStatus.UNDER_BEHANDLING:
      return `/behandling/${behandlingId}/inngangsvilkar/kravfrist`;
    case BehandlingStatus.KLAR_TIL_BESLUTNING:
    case BehandlingStatus.UNDER_BESLUTNING:
      return `/behandling/${behandlingId}/oppsummering`;
    default:
      return '/';
  }
};

interface KnappForBehandlingTypeProps {
  status: BehandlingStatus;
  saksbehandler: string;
  beslutter: string;
  behandlingId: string;
}

export const KnappForBehandlingType = ({
  status,
  saksbehandler,
  beslutter,
  behandlingId,
}: KnappForBehandlingTypeProps) => {
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { onOpprettBehandling } = useOpprettBehandling();
  const { onTaBehandling } = useTaBehandling(finnLenke(behandlingId, status));

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
      if (
        eierBehandling(status, innloggetSaksbehandler, saksbehandler, beslutter)
      ) {
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
      if (
        skalKunneTaBehandling(status, innloggetSaksbehandler, saksbehandler)
      ) {
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
