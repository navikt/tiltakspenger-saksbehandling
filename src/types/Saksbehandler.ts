export interface Saksbehandler {
  brukernavn: string;
  epost: string;
  navIdent: string;
  roller: string[];
}

/*
 *  Tilgjengelige saksbehandlerroller:
 *       SAKSBEHANDLER - Standardrollen
 *       BESLUTTER     - Nødvendig for å kunne godkjenne behandlinger
 *       ADMINISTRATOR - Skal ha tilgang til egne superbrukerfunksjoner
 * */

enum Rolle {
  SAKSBEHANDLER = 'SAKSBEHANDLER',
  FORTROLIG_ADRESSE = 'FORTROLIG_ADRESSE',
  STRENGT_FORTROLIG_ADRESSE = 'STRENGT_FORTROLIG_ADRESSE',
  SKJERMING = 'SKJERMING',
  LAGE_HENDELSER = 'LAGE_HENDELSER',
  DRIFT = 'DRIFT', // Systemadministrator (oss)
  BESLUTTER = 'BESLUTTER',
  ADMINISTRATOR = 'ADMINISTRATOR', // Saksbehandlers administrator (superbruker)
}
