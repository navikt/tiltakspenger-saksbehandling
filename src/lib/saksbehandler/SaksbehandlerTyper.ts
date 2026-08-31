export enum SaksbehandlerRolle {
    SAKSBEHANDLER = 'SAKSBEHANDLER',
    BESLUTTER = 'BESLUTTER',
    UTVIKLER = 'UTVIKLER',
    VEILEDER = 'VEILEDER',
    TILBAKEKREVING = 'TILBAKEKREVING',

    FORTROLIG_ADRESSE = 'FORTROLIG_ADRESSE',
    STRENGT_FORTROLIG_ADRESSE = 'STRENGT_FORTROLIG_ADRESSE',
    SKJERMING = 'SKJERMING',
}

export type Saksbehandler = {
    brukernavn: string;
    epost: string;
    navIdent: string;
    roller: SaksbehandlerRolle[];
};
