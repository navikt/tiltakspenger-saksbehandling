export type MeldekortListe = {
    meldekort: Meldekort[];
};

export type Meldekort = {
    id: string;
    fom: Date;
    tom: Date;
    antallDagerPåTiltaket: number,
    tiltaksType: string;
    meldekortUke1: MeldekortDag[]; 
    meldekortUke2: MeldekortDag[];
};

export type MeldekortDag = {
    dag: string;
    dato: Date;
    status: MeldekortStatus
};

export enum MeldekortStatus {
    DELTATT = "Deltatt",
    IKKE_DELTATT = "Ikke deltatt",
    FRAVÆR_SYK = "Fravær syk",
    FRAVÆR_SYKT_BARN = "Fravær sykt barn",
    FRAVÆR_VELFERD = "Fravær velferd",
    LØNN_FOR_TID_I_ARBEID = "Lønn for tid i arbeid",

};