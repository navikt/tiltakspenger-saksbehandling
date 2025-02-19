export enum SaksbehandlerRolle {
    SAKSBEHANDLER = 'SAKSBEHANDLER',
    BESLUTTER = 'BESLUTTER',
    FORTROLIG_ADRESSE = 'FORTROLIG_ADRESSE',
    STRENGT_FORTROLIG_ADRESSE = 'STRENGT_FORTROLIG_ADRESSE',
    SKJERMING = 'SKJERMING',
    DRIFT = 'DRIFT',
}

export type Saksbehandler = {
    brukernavn: string;
    epost: string;
    navIdent: string;
    roller: SaksbehandlerRolle[];
};

export const erSaksbehandler = (saksbehandler: Saksbehandler) =>
    saksbehandler.roller.includes(SaksbehandlerRolle.SAKSBEHANDLER);

export const erBeslutter = (saksbehandler: Saksbehandler) =>
    saksbehandler.roller.includes(SaksbehandlerRolle.BESLUTTER);
