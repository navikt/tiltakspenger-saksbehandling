import { BehandlingStatus } from '../types/BehandlingTypes';
import { Saksbehandler } from '../types/Saksbehandler';

export const kanBeslutteForBehandling = (
  status: string,
  innloggetSaksbehandler: Saksbehandler,
  beslutterForBehandling: string,
) => {
  return (
    innloggetSaksbehandler.roller.includes('BESLUTTER') &&
    beslutterForBehandling &&
    status === BehandlingStatus.UNDER_BESLUTNING
  );
};

export const kanSaksbehandleForBehandling = (
  status: string,
  innloggetSaksbehandler: Saksbehandler,
  saksbehandlerForBehandling: string,
) => {
  return (
    innloggetSaksbehandler.roller.includes('SAKSBEHANDLER') &&
    innloggetSaksbehandler.navIdent == saksbehandlerForBehandling &&
    status === BehandlingStatus.UNDER_BEHANDLING
  );
};

export const skalKunneTaBehandling = (
  status: string,
  innloggetSaksbehandler,
  saksbehandlerForBehandling?: string,
) => {
  switch (status) {
    case BehandlingStatus.KLAR_TIL_BESLUTNING ||
      BehandlingStatus.UNDER_BESLUTNING:
      return (
        innloggetSaksbehandler.roller.includes('BESLUTTER') &&
        innloggetSaksbehandler.navIdent != saksbehandlerForBehandling
      );
    case BehandlingStatus.KLAR_TIL_BEHANDLING ||
      BehandlingStatus.UNDER_BEHANDLING:
      return innloggetSaksbehandler.roller.includes('SAKSBEHANDLER');
    default:
      return false;
  }
};
