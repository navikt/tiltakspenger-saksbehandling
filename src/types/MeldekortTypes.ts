import { Periode } from './Periode';

export enum MeldeperiodeStatus {
    IKKE_RETT_TIL_TILTAKSPENGER = 'IKKE_RETT_TIL_TILTAKSPENGER',
    IKKE_KLAR_TIL_UTFYLLING = 'IKKE_KLAR_TIL_UTFYLLING',
    VENTER_PÅ_UTFYLLING = 'VENTER_PÅ_UTFYLLING',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    GODKJENT = 'GODKJENT',
}

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

export type MeldeperiodeSammendragProps = {
    meldeperiodeId: string;
    hendelseId: string;
    hendelseVersjon: number;
    periode: Periode;
    saksbehandler?: string;
    beslutter?: string;
    status: MeldeperiodeStatus;
};

export type MeldekortBehandlingProps = {
    id: string;
    saksbehandler: string;
    beslutter?: string;
    status: MeldekortBehandlingStatus;
    totalbeløpTilUtbetaling: number;
    navkontor?: string;
    navkontorNavn?: string;
    forrigeNavkontor?: string;
    forrigeNavkontorNavn?: string;
    dager: MeldekortBehandlingDagBeregnet[];
};

export type MeldekortBehandlingDag = {
    dato: string;
    status: MeldekortBehandlingDagStatus;
};

export type MeldekortBehandlingDagBeregnet = MeldekortBehandlingDag & {
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

export type MeldeperiodeProps = {
    id: string;
    hendelseId: string;
    versjon: number;
    periode: Periode;
    opprettet: string;
    status: MeldeperiodeStatus;
    antallDager: number;
    girRett: Record<string, boolean>;
    meldekortBehandling?: MeldekortBehandlingProps;
    brukersMeldekort?: BrukersMeldekortProps;
};

export type MeldeperiodeKjedeProps = {
    meldeperiodeId: string;
    periode: Periode;
    tiltaksnavn: string;
    vedtaksPeriode: Periode;
    meldeperioder: MeldeperiodeProps[];
};

export type Beregningsdag = {
    beløp: number;
    prosent: number;
};

export type MeldekortDTO = {
    dager: MeldekortBehandlingDag[];
};

export const Meldekortstatuser = Object.values(MeldekortBehandlingDagStatus).filter(
    (status) =>
        ![MeldekortBehandlingDagStatus.Sperret, MeldekortBehandlingDagStatus.IkkeUtfylt].includes(
            status,
        ),
);
