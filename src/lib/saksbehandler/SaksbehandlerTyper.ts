export enum SaksbehandlerRolle {
    SAKSBEHANDLER = 'SAKSBEHANDLER',
    BESLUTTER = 'BESLUTTER',
    UTVIKLER = 'UTVIKLER',
    VEILEDER = 'VEILEDER',
}

export type Saksbehandler = {
    brukernavn: string;
    epost: string;
    navIdent: string;
    roller: SaksbehandlerRolle[];
};
