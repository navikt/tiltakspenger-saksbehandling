import { Periode } from './Periode';

export type Meldekortsammendrag = {
    meldekortId: string;
    periode: Periode;
    status: MeldekortBehandlingStatus;
    saksbehandler?: string;
    beslutter?: string;
};

export enum Meldeperiodestatus {
    IKKE_RETT_TIL_TILTAKSPENGER = 'IKKE_RETT_TIL_TILTAKSPENGER',
    IKKE_KLAR_TIL_UTFYLLING = 'IKKE_KLAR_TIL_UTFYLLING',
    VENTER_PÅ_UTFYLLING = 'VENTER_PÅ_UTFYLLING',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    GODKJENT = 'GODKJENT',
}

export type MeldeperiodeSammendrag = {
    meldeperiodeId: string;
    hendelseId: string;
    hendelseVersjon: number;
    periode: Periode;
    saksbehandler?: string;
    beslutter?: string;
    status: Meldeperiodestatus;
};

export type MeldekortBehandling = {
    id: string;
    saksbehandler: string;
    beslutter?: string;
    status: MeldekortBehandlingStatus;
    totalbeløpTilUtbetaling: number;
    navkontor?: string;
    forrigeNavkontor?: string;
    dager: MeldekortDag[];
};

export enum BrukersMeldekortDagStatus {
    DELTATT = 'DELTATT',
    FRAVÆR_SYK = 'FRAVÆR_SYK',
    FRAVÆR_SYKT_BARN = 'FRAVAeR_SYKT_BARN',
    FRAVÆR_ANNET = 'FRAVÆR_ANNET',
    IKKE_REGISTRERT = 'IKKE_REGISTRERT',
}

export type BrukersMeldekortDag = {
    dato: string;
    status: BrukersMeldekortDagStatus;
};

export type BrukersMeldekort = {
    id: string;
    mottatt: string;
    dager: BrukersMeldekortDag[];
};

export type Meldeperiode = {
    id: string;
    hendelseId: string;
    versjon: number;
    periode: Periode;
    opprettet: string;
    status: Meldeperiodestatus;
    antallDager: number;
    girRett: Record<string, boolean>;
    meldekortBehandling?: MeldekortBehandling;
    brukersMeldekort?: BrukersMeldekort;
};

export type MeldeperiodeKjede = {
    meldeperiodeId: string;
    periode: Periode;
    tiltaksnavn: string;
    vedtaksPeriode: Periode;
    meldeperioder: Meldeperiode[];
};

export enum MeldekortBehandlingStatus {
    IKKE_RETT_TIL_TILTAKSPENGER = 'IKKE_RETT_TIL_TILTAKSPENGER',
    KLAR_TIL_UTFYLLING = 'KLAR_TIL_UTFYLLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    GODKJENT = 'GODKJENT',
}

export type MeldekortDag = {
    dato: string;
    status: MeldekortdagStatus;
    reduksjonAvYtelsePåGrunnAvFravær?: ReduksjonAvYtelse;
    beregningsdag: Beregningsdag;
};

export type Beregningsdag = {
    beløp: number;
    prosent: number;
};

export type MeldekortDagDTO = {
    dato: string;
    status: string;
};

export type Sats = {
    periode: Periode;
    sats: number;
    satsDelvis: number;
};

export enum ReduksjonAvYtelse {
    INGEN_REDUKSJON = 'INGEN_REDUKSJON',
    DELVIS_REDUKSJON = 'DELVIS_REDUKSJON',
    YTELSEN_FALLER_BORT = 'YTELSEN_FALLER_BORT',
}

export enum Tiltakstype {
    ARBEIDSFORBEREDENDE_TRENING,
    ARBEIDSRETTET_REHABILITERING,
    ARBEIDSTRENING,
    AVKLARING,
    DIGITAL_JOBBKLUBB,
    ENKELTPLASS_AMO,
    ENKELTPLASS_VGS_OG_HØYERE_YRKESFAG,
    FORSØK_OPPLÆRING_LENGRE_VARIGHET,
    GRUPPE_AMO,
    GRUPPE_VGS_OG_HØYERE_YRKESFAG,
    HØYERE_UTDANNING,
    INDIVIDUELL_JOBBSTØTTE,
    INDIVIDUELL_KARRIERESTØTTE_UNG,
    JOBBKLUBB,
    OPPFØLGING,
    UTVIDET_OPPFØLGING_I_NAV,
    UTVIDET_OPPFØLGING_I_OPPLÆRING,
}

export type MeldekortDTO = {
    dager: MeldekortDagDTO[];
    navkontor: string;
};

export enum MeldekortdagStatus {
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

export const Meldekortstatuser = Object.values(MeldekortdagStatus).filter(
    (status) => ![MeldekortdagStatus.Sperret, MeldekortdagStatus.IkkeUtfylt].includes(status),
);
