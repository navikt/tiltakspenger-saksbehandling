export enum SaksbehandlerRolle {
    SAKSBEHANDLER = 'SAKSBEHANDLER',
    BESLUTTER = 'BESLUTTER',
    UTVIKLER = 'UTVIKLER',
    VEILEDER = 'VEILEDER',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

export type Saksbehandler = {
    brukernavn: string;
    epost: string;
    navIdent: string;
    roller: SaksbehandlerRolle[];
    sladdes: boolean;
    kanSeBenken: boolean;
};
