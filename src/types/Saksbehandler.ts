export interface Saksbehandler {
  brukernavn: string;
  epost: string;
  navIdent: string;
  roller: string[];
}

export const erSaksbehandler = (saksbehandler: Saksbehandler) =>
  saksbehandler.roller.includes('SAKSBEHANDLER');

export const erBeslutter = (saksbehandler: Saksbehandler) =>
  saksbehandler.roller.includes('BESLUTTER');
