export enum BrukersMeldekortDagStatus {
    DELTATT = 'DELTATT',
    FRAVÆR_SYK = 'FRAVÆR_SYK',
    FRAVÆR_SYKT_BARN = 'FRAVAeR_SYKT_BARN',
    FRAVÆR_ANNET = 'FRAVÆR_ANNET',
    IKKE_REGISTRERT = 'IKKE_REGISTRERT',
    IKKE_RETT_TIL_TILTAKSPENGER = 'IKKE_RETT_TIL_TILTAKSPENGER',
}

export enum MeldekortBehandlingStatus {
    KLAR_TIL_UTFYLLING = 'KLAR_TIL_UTFYLLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    GODKJENT = 'GODKJENT',
    IKKE_RETT_TIL_TILTAKSPENGER = 'IKKE_RETT_TIL_TILTAKSPENGER',
}

export enum MeldekortBehandlingDagStatus {
    Sperret = 'SPERRET',
    IkkeUtfylt = 'IKKE_UTFYLT',
    DeltattUtenLønnITiltaket = 'DELTATT_UTEN_LØNN_I_TILTAKET',
    DeltattMedLønnITiltaket = 'DELTATT_MED_LØNN_I_TILTAKET',
    IkkeDeltatt = 'IKKE_DELTATT',
    FraværSyk = 'FRAVÆR_SYK',
    FraværSyktBarn = 'FRAVÆR_SYKT_BARN',
    FraværVelferdGodkjentAvNav = 'FRAVÆR_VELFERD_GODKJENT_AV_NAV',
    FraværVelferdIkkeGodkjentAvNav = 'FRAVÆR_VELFERD_IKKE_GODKJENT_AV_NAV',
}

export enum ReduksjonAvYtelse {
    INGEN_REDUKSJON = 'INGEN_REDUKSJON',
    DELVIS_REDUKSJON = 'DELVIS_REDUKSJON',
    YTELSEN_FALLER_BORT = 'YTELSEN_FALLER_BORT',
}

export type MeldekortBehandlingProps = {
    id: string;
    saksbehandler: string;
    beslutter?: string;
    status: MeldekortBehandlingStatus;
    totalbeløpTilUtbetaling: number;
    navkontor: string;
    navkontorNavn?: string;
    dager: MeldekortBehandlingDagBeregnet[];
};

export type MeldekortBehandlingDagProps = {
    dato: string;
    status: MeldekortBehandlingDagStatus;
};

export type MeldekortBehandlingDagBeregnet = MeldekortBehandlingDagProps & {
    reduksjonAvYtelsePåGrunnAvFravær?: ReduksjonAvYtelse;
    beregningsdag: Beregningsdag;
};

export type BrukersMeldekortDagProps = {
    dato: string;
    status: BrukersMeldekortDagStatus;
};

export type BrukersMeldekortProps = {
    id: string;
    mottatt: string;
    dager: BrukersMeldekortDagProps[];
};

type Beregningsdag = {
    beløp: number;
    prosent: number;
};

export type MeldekortBehandlingDTO = {
    dager: MeldekortBehandlingDagProps[];
};
