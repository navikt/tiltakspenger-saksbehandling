import { Button } from '@navikt/ds-react';
import router from 'next/router';
import { BehandlingStatus } from '../../types/BehandlingTypes';
import { eierBehandling, skalKunneTaBehandling } from '../../utils/tilganger';
import { useOpprettBehandling } from '../../hooks/useOpprettBehandling';
import { useTaBehandling } from '../../hooks/useTaBehandling';
import { useContext } from 'react';
import { SaksbehandlerContext } from '../../pages/_app';

export const benkknapp = (
  variant: 'primary' | 'secondary' | 'tertiary',
  onClick: () => void,
  tekst: string,
) => (
  <Button
    style={{ minWidth: '50%' }}
    size="small"
    variant={variant}
    onClick={onClick}
  >
    {tekst}
  </Button>
);

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
  const { onTaBehandling } = useTaBehandling();

  const inngangsvilkårlenke = `/behandling/${behandlingId}/inngangsvilkar/kravfrist`;
  const oppsummeringlenke = `/behandling/${behandlingId}/oppsummering`;

  switch (status) {
    case BehandlingStatus.SØKNAD:
      return benkknapp(
        'primary',
        () => onOpprettBehandling({ id: behandlingId }),
        'Opprett behandling',
      );
    case BehandlingStatus.UNDER_BEHANDLING:
      if (
        eierBehandling(status, innloggetSaksbehandler, saksbehandler, beslutter)
      ) {
        return benkknapp(
          'secondary',
          () => router.push(inngangsvilkårlenke),
          'Fortsett',
        );
      }
    case BehandlingStatus.UNDER_BESLUTNING:
      if (
        eierBehandling(status, innloggetSaksbehandler, saksbehandler, beslutter)
      ) {
        return benkknapp(
          'secondary',
          () => router.push(oppsummeringlenke),
          'Fortsett',
        );
      }
    case BehandlingStatus.KLAR_TIL_BEHANDLING:
      if (
        skalKunneTaBehandling(status, innloggetSaksbehandler, saksbehandler)
      ) {
        return benkknapp(
          'primary',
          () => {
            onTaBehandling({ id: behandlingId });
            router.push(inngangsvilkårlenke);
          },
          'Tildel meg',
        );
      }
    case BehandlingStatus.KLAR_TIL_BESLUTNING:
      if (
        skalKunneTaBehandling(status, innloggetSaksbehandler, saksbehandler)
      ) {
        return benkknapp(
          'primary',
          () => {
            onTaBehandling({ id: behandlingId });
            router.push(oppsummeringlenke);
          },
          'Tildel meg',
        );
      }
    default:
      return <></>;
  }
};
