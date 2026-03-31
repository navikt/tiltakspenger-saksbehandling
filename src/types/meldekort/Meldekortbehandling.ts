import { MeldeperiodeId } from './Meldeperiode';
import { Periode } from '../Periode';
import { BrukersMeldekortId } from './BrukersMeldekort';
import { Avbrutt } from '../Avbrutt';
import { Nullable } from '~/types/UtilTypes';
import { BeløpProps, MeldeperiodeBeregningProps } from '~/types/Beregning';
import { SakId } from '../Sak';
import { SimulertBeregning } from '~/types/SimulertBeregning';
import { KanIkkeIverksetteUtbetalingGrunn, Utbetalingsstatus } from '../Utbetaling';
import { Attestering } from '../Attestering';
import { TilbakekrevingId } from '~/types/Tilbakekreving';

// "_behandling"-suffixen er ikke reell, er kun for at typescript ikke skal se denne som ekvivalent med BrukersMeldekortId
// Ikke gjør run-time typesjekk på denne!
export type MeldekortbehandlingId = `meldekort_${string}_behandling`;

export enum MeldekortbehandlingStatus {
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
    GODKJENT = 'GODKJENT',
    IKKE_RETT_TIL_TILTAKSPENGER = 'IKKE_RETT_TIL_TILTAKSPENGER',
    AUTOMATISK_BEHANDLET = 'AUTOMATISK_BEHANDLET',
    AVBRUTT = 'AVBRUTT',
}

export enum MeldekortbehandlingDagStatus {
    // OBS! Ved endring av disse kodene så burde tilsvarende endringer gjøres for tekstene som utledes for brevene!
    IkkeRettTilTiltakspenger = 'IKKE_RETT_TIL_TILTAKSPENGER',
    IkkeBesvart = 'IKKE_BESVART',
    DeltattUtenLønnITiltaket = 'DELTATT_UTEN_LØNN_I_TILTAKET',
    DeltattMedLønnITiltaket = 'DELTATT_MED_LØNN_I_TILTAKET',
    IkkeTiltaksdag = 'IKKE_TILTAKSDAG',
    FraværSyk = 'FRAVÆR_SYK',
    FraværSyktBarn = 'FRAVÆR_SYKT_BARN',
    FraværSterkeVelferdsgrunnerEllerJobbintervju = 'FRAVÆR_STERKE_VELFERDSGRUNNER_ELLER_JOBBINTERVJU',
    FraværGodkjentAvNav = 'FRAVÆR_GODKJENT_AV_NAV',
    FraværAnnet = 'FRAVÆR_ANNET',
}

export enum ReduksjonAvYtelse {
    INGEN_REDUKSJON = 'INGEN_REDUKSJON',
    DELVIS_REDUKSJON = 'DELVIS_REDUKSJON',
    YTELSEN_FALLER_BORT = 'YTELSEN_FALLER_BORT',
}

export enum MeldekortbehandlingType {
    FØRSTE_BEHANDLING = 'FØRSTE_BEHANDLING',
    KORRIGERING = 'KORRIGERING',
}

export type MeldekortbehandlingProps = {
    id: MeldekortbehandlingId;
    sakId: SakId;
    meldeperiodeId: MeldeperiodeId;
    brukersMeldekortId?: BrukersMeldekortId;
    saksbehandler?: string;
    beslutter?: string;
    opprettet: string;
    godkjentTidspunkt?: string;
    status: MeldekortbehandlingStatus;
    erAvsluttet: boolean;
    navkontor: string;
    navkontorNavn?: string;
    begrunnelse?: string;
    type: MeldekortbehandlingType;
    attesteringer: Attestering[];
    utbetalingsstatus: Utbetalingsstatus;
    periode: Periode;
    dager: MeldekortDagProps[];
    beregning?: MeldekortBeregning;
    avbrutt?: Avbrutt;
    simulertBeregning: Nullable<SimulertBeregning>;
    kanIkkeIverksetteUtbetaling: Nullable<KanIkkeIverksetteUtbetalingGrunn>;
    tekstTilVedtaksbrev: Nullable<string>;
    tilbakekrevingId: Nullable<TilbakekrevingId>;
};

export type MeldekortDagProps = {
    dato: string;
    status: MeldekortbehandlingDagStatus;
};

export type MeldekortDagBeregnetProps = {
    dato: string;
    status: MeldekortbehandlingDagStatus;
    reduksjonAvYtelsePåGrunnAvFravær?: ReduksjonAvYtelse;
    beregningsdag?: Beregningsdag;
};

export type MeldekortBeregning = {
    totalBeløp: BeløpProps;
    beregningForMeldekortetsPeriode: MeldeperiodeBeregningProps;
    beregningerForPåfølgendePerioder: MeldeperiodeBeregningProps[];
};

type Beregningsdag = {
    beløp: number;
    prosent: number;
    barnetillegg: number;
};

export type MeldekortbehandlingDTO = {
    dager: MeldekortDagProps[];
    begrunnelse: Nullable<string>;
    tekstTilVedtaksbrev: Nullable<string>;
};
