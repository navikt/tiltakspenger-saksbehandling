export interface Saksbehandler {
  brukernavn: string;
  epost: string;
  navIdent: string;
  roller: string[];
  isSaksbehandler: boolean;
  isBeslutter: boolean;
  isAdmin: boolean;
}
