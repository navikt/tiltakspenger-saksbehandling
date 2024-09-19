import { BehandlingStatus } from '../types/BehandlingTypes';
import { Meldekortstatus } from '../types/MeldekortTypes';
import { Saksbehandler } from '../types/Saksbehandler';

export const kanBeslutteForBehandling = (
  status: string,
  innloggetSaksbehandler: Saksbehandler,
  saksbehandlerForBehandling: string,
  beslutterForBehandling: string,
) => {
  return (
    innloggetSaksbehandler.isBeslutter &&
    innloggetSaksbehandler.navIdent === beslutterForBehandling &&
    innloggetSaksbehandler.navIdent !== saksbehandlerForBehandling &&
    (status === BehandlingStatus.UNDER_BESLUTNING ||
      status === Meldekortstatus.KLAR_TIL_BESLUTNING)
  );
};

export const kanSaksbehandleForBehandling = (
  status: string,
  innloggetSaksbehandler: Saksbehandler,
  saksbehandlerForBehandling: string,
) => {
  return (
    innloggetSaksbehandler.isSaksbehandler &&
    innloggetSaksbehandler.navIdent === saksbehandlerForBehandling &&
    (status === BehandlingStatus.UNDER_BEHANDLING ||
      status === Meldekortstatus.KLAR_TIL_UTFYLLING)
  );
};

export const eierBehandling = (
  status: string,
  innloggetSaksbehandler,
  saksbehandlerForBehandling: string,
  beslutterForBehandling: string,
) => {
  switch (status) {
    case BehandlingStatus.UNDER_BEHANDLING:
      return innloggetSaksbehandler.navIdent == saksbehandlerForBehandling;
    case BehandlingStatus.UNDER_BESLUTNING:
      return innloggetSaksbehandler.navIdent == beslutterForBehandling;
  }
};

export const skalKunneTaBehandling = (
  status: string,
  innloggetSaksbehandler,
  saksbehandlerForBehandling?: string,
) => {
  switch (status) {
    case BehandlingStatus.KLAR_TIL_BESLUTNING:
      return (
        innloggetSaksbehandler.isBeslutter &&
        innloggetSaksbehandler.navIdent != saksbehandlerForBehandling
      );
    case BehandlingStatus.KLAR_TIL_BEHANDLING:
      return innloggetSaksbehandler.isSaksbehandler;
    default:
      return false;
  }
};

export const kanTaAvBehandling = (
  status: string,
  innloggetSaksbehandler: Saksbehandler,
  saksbehandlerForBehandling: string,
  beslutterForBehandling?: string,
) => {
  switch (status) {
    case BehandlingStatus.KLAR_TIL_BESLUTNING:
    case BehandlingStatus.UNDER_BESLUTNING:
      return (
        innloggetSaksbehandler.isBeslutter &&
        innloggetSaksbehandler.navIdent === beslutterForBehandling
      );
    case BehandlingStatus.KLAR_TIL_BEHANDLING:
    case BehandlingStatus.UNDER_BEHANDLING:
      return (
        innloggetSaksbehandler.isSaksbehandler &&
        innloggetSaksbehandler.navIdent === saksbehandlerForBehandling
      );
    default:
      return false;
  }
};
