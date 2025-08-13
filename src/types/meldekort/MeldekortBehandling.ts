import { Attestering } from '../BehandlingTypes';
import { MeldeperiodeId, MeldeperiodeKjedeId } from './Meldeperiode';
import { Periode } from '../Periode';
import { BrukersMeldekortId } from './BrukersMeldekort';
import { Avbrutt } from '../Avbrutt';
import { Simulering } from '../Simulering';

import { Nullable } from '~/types/UtilTypes';

// "_behandling"-suffixen er ikke reell, er kun for at typescript ikke skal se denne som ekvivalent med BrukersMeldekortId
// Ikke gjør run-time typesjekk på denne!
export type MeldekortBehandlingId = `meldekort_${string}_behandling`;

export enum MeldekortBehandlingStatus {
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
    GODKJENT = 'GODKJENT',
    IKKE_RETT_TIL_TILTAKSPENGER = 'IKKE_RETT_TIL_TILTAKSPENGER',
    AUTOMATISK_BEHANDLET = 'AUTOMATISK_BEHANDLET',
    AVBRUTT = 'AVBRUTT',
}

export enum MeldekortBehandlingDagStatus {
    // OBS! Ved endring av disse kodene så burde tilsvarende endringer gjøres for tekstene som utledes for brevene!
    IkkeRettTilTiltakspenger = 'IKKE_RETT_TIL_TILTAKSPENGER',
    IkkeBesvart = 'IKKE_BESVART',
    DeltattUtenLønnITiltaket = 'DELTATT_UTEN_LØNN_I_TILTAKET',
    DeltattMedLønnITiltaket = 'DELTATT_MED_LØNN_I_TILTAKET',
    IkkeTiltaksdag = 'IKKE_TILTAKSDAG',
    FraværSyk = 'FRAVÆR_SYK',
    FraværSyktBarn = 'FRAVÆR_SYKT_BARN',
    FraværGodkjentAvNav = 'FRAVÆR_GODKJENT_AV_NAV',
    FraværAnnet = 'FRAVÆR_ANNET',
}

export enum ReduksjonAvYtelse {
    INGEN_REDUKSJON = 'INGEN_REDUKSJON',
    DELVIS_REDUKSJON = 'DELVIS_REDUKSJON',
    YTELSEN_FALLER_BORT = 'YTELSEN_FALLER_BORT',
}

export enum MeldekortBehandlingType {
    FØRSTE_BEHANDLING = 'FØRSTE_BEHANDLING',
    KORRIGERING = 'KORRIGERING',
}

export enum Utbetalingsstatus {
    IKKE_GODKJENT = 'IKKE_GODKJENT',
    IKKE_SENDT_TIL_HELVED = 'IKKE_SENDT_TIL_HELVED',
    SENDT_TIL_HELVED = 'SENDT_TIL_HELVED',
    SENDT_TIL_OPPDRAG = 'SENDT_TIL_OPPDRAG',
    OK_UTEN_UTBETALING = 'OK_UTEN_UTBETALING',
    OK = 'OK',
    FEILET_MOT_OPPDRAG = 'FEILET_MOT_OPPDRAG',
    AVBRUTT = 'AVBRUTT',
}

export type MeldekortBehandlingProps = {
    id: MeldekortBehandlingId;
    meldeperiodeId: MeldeperiodeId;
    brukersMeldekortId?: BrukersMeldekortId;
    saksbehandler?: string;
    beslutter?: string;
    opprettet: string;
    godkjentTidspunkt?: string;
    status: MeldekortBehandlingStatus;
    erAvsluttet: boolean;
    navkontor: string;
    navkontorNavn?: string;
    begrunnelse?: string;
    type: MeldekortBehandlingType;
    attesteringer: Attestering[];
    utbetalingsstatus: Utbetalingsstatus;
    periode: Periode;
    dager: MeldekortDagProps[];
    beregning?: MeldekortBeregning;
    avbrutt?: Avbrutt;
    simulering: Nullable<Simulering>;
};

export type MeldekortDagProps = {
    dato: string;
    status: MeldekortBehandlingDagStatus;
};

export type MeldekortDagBeregnetProps = {
    dato: string;
    status: MeldekortBehandlingDagStatus;
    reduksjonAvYtelsePåGrunnAvFravær?: ReduksjonAvYtelse;
    beregningsdag?: Beregningsdag;
};

export type MeldekortBeregning = {
    totalBeløp: MeldekortBeløpProps;
    beregningForMeldekortetsPeriode: MeldeperiodeBeregning;
    beregningerForPåfølgendePerioder: MeldeperiodeBeregning[];
};

export type MeldeperiodeBeregning = {
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    beløp: MeldekortBeløpProps;
    dager: MeldekortDagBeregnetProps[];
};

export type MeldekortBeløpProps = {
    totalt: number;
    ordinært: number;
    barnetillegg: number;
};

type Beregningsdag = {
    beløp: number;
    prosent: number;
    barnetillegg: number;
};

export type MeldekortBehandlingDTO = {
    dager: MeldekortDagProps[];
    begrunnelse?: string;
};
