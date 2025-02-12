export type MeldekortBehandlingId = `meldekort_${string}`;

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
    // Denne er forvirrende, betyr her "ikke tiltak denne dagen", men i brukers meldekort betyr den "ikke godkjent fravær"
    // Bør renames ett av stedene
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
    id: MeldekortBehandlingId;
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

type Beregningsdag = {
    beløp: number;
    prosent: number;
};

export type MeldekortBehandlingDTO = {
    dager: MeldekortBehandlingDagProps[];
};
