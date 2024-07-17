import { Saksbehandler } from '../types/Saksbehandler';

export const kanBeslutteForBehandling = (
  beslutterForBehandling: string,
  innloggetSaksbehandler: Saksbehandler,
  behandlingTilstand: string,
) => {
  return (
    innloggetSaksbehandler.roller.includes('BESLUTTER') &&
    beslutterForBehandling &&
    behandlingTilstand === 'tilBeslutter'
  );
};

export const kanSaksbehandleForBehandling = (
  saksbehandlerForBehandling: string,
  innloggetSaksbehandler: Saksbehandler,
  behandlingTilstand: string,
) => {
  return (
    innloggetSaksbehandler.roller.includes('SAKSBEHANDLER') &&
    innloggetSaksbehandler.navIdent == saksbehandlerForBehandling &&
    behandlingTilstand !== 'tilBeslutter' &&
    behandlingTilstand !== 'iverksatt'
  );
};

export const skalKunneTaBehandling = (
  type: string,
  innloggetSaksbehandler,
  saksbehandlerForBehandling?: string,
  beslutterForBehandling?: string,
) => {
  switch (type) {
    case 'Klar til beslutning':
      return (
        innloggetSaksbehandler.roller.includes('BESLUTTER') &&
        !beslutterForBehandling &&
        innloggetSaksbehandler.navIdent != saksbehandlerForBehandling
      );
    case 'Klar til behandling':
      return (
        innloggetSaksbehandler.roller.includes('SAKSBEHANDLER') &&
        !saksbehandlerForBehandling
      );
    default:
      return false;
  }
};

export const behandlingLinkAktivert = (
  innloggetSaksbehandler: Saksbehandler,
  saksbehandlerForBehandling?: string,
  beslutterForBehandling?: string,
) => {
  return (
    innloggetSaksbehandler?.navIdent == saksbehandlerForBehandling ||
    innloggetSaksbehandler?.navIdent == beslutterForBehandling ||
    innloggetSaksbehandler.roller.includes('ADMINISTRATOR')
  );
};
