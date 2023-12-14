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
