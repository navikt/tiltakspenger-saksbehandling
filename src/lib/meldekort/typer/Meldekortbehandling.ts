import { MeldeperiodeId } from './Meldeperiode';
import { Nullable } from '~/types/UtilTypes';
import { BrukersMeldekortId } from '~/lib/meldekort/typer/BrukersMeldekort';
import { Periode } from '~/types/Periode';
import { MeldeperiodeBeregningProps } from '~/lib/beregning-og-simulering/typer/Beregning';
import { SakId } from '~/lib/sak/SakTyper';
import { Attestering } from '~/lib/behandling-felles/typer/Attestering';
import {
    KanIkkeIverksetteUtbetalingGrunn,
    Utbetalingskontroll,
    Utbetalingsstatus,
} from '~/lib/_felles/utbetaling/utbetalingTyper';
import { Avbrutt } from '~/lib/behandling-felles/typer/Avbrutt';
import { SimulertBeregning } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { TilbakekrevingId } from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { KlageId } from '~/lib/klage/typer/Klage';
import { VentestatusHendelse } from '~/lib/behandling-felles/typer/Ventestatus';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiodekjede';

export const MeldekortbehandlingPrefix = 'meldekort_' as const;

export type MeldekortbehandlingId = `${typeof MeldekortbehandlingPrefix}${string}`;

export enum MeldekortbehandlingStatus {
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
    GODKJENT = 'GODKJENT',
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

export enum MeldeperiodebehandlingType {
    FØRSTE_BEHANDLING = 'FØRSTE_BEHANDLING',
    KORRIGERING = 'KORRIGERING',
}

export type MeldekortDagProps = {
    dato: string;
    status: MeldekortbehandlingDagStatus;
};

export type MeldekortDagBeregnetProps = {
    dato: string;
    status: MeldekortbehandlingDagStatus;
    reduksjonAvYtelsePåGrunnAvFravær?: ReduksjonAvYtelse;
    beregningsdag?: MeldekortBeregningsdag;
};

export type MeldekortBeregningsdag = {
    beløp: number;
    prosent: number;
    barnetillegg: number;
};

export type OppdaterMeldekortbehandlingDTO = {
    meldeperioder: OppdatertMeldeperiodeDTO[];
    begrunnelse: Nullable<string>;
    tekstTilVedtaksbrev: Nullable<string>;
    skalSendeVedtaksbrev: boolean;
};

export type OppdatertMeldeperiodeDTO = {
    dager: OppdaterMeldekortdagDTO[];
    kjedeId: MeldeperiodeKjedeId;
};

type OppdaterMeldekortdagDTO = {
    dato: string;
    status: MeldekortbehandlingDagStatus;
};

export type MeldeperiodebehandlingProps = {
    meldeperiodeId: MeldeperiodeId;
    kjedeId: MeldeperiodeKjedeId;
    brukersMeldekortId: BrukersMeldekortId[];
    periode: Periode;
    dager: MeldekortDagProps[];
    beregning: Nullable<MeldeperiodeBeregningProps>;
    type: MeldeperiodebehandlingType;
};

export type MeldekortbehandlingProps = {
    id: MeldekortbehandlingId;
    sakId: SakId;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    opprettet: string;
    sistEndret: string;
    godkjentTidspunkt: Nullable<string>;
    status: MeldekortbehandlingStatus;
    erAvsluttet: boolean;
    navkontor: string;
    navkontorNavn: Nullable<string>;
    begrunnelse: Nullable<string>;
    attesteringer: Attestering[];
    utbetalingsstatus: Utbetalingsstatus;
    /** Sammenhengende totalperiode på tvers av alle meldeperioder */
    periode: Periode;
    meldeperioder: MeldeperiodebehandlingProps[];
    avbrutt: Nullable<Avbrutt>;
    simulertBeregning: Nullable<SimulertBeregning>;
    utbetalingskontroll: Nullable<Utbetalingskontroll>;
    kanIkkeIverksetteUtbetaling: Nullable<KanIkkeIverksetteUtbetalingGrunn>;
    kanIkkeIverksetteUtbetalingMelding: Nullable<string>;
    tekstTilVedtaksbrev: Nullable<string>;
    tilbakekrevingId: Nullable<TilbakekrevingId>;
    klagebehandlingId: Nullable<KlageId>;
    skalSendeVedtaksbrev: boolean;
    ventestatus: VentestatusHendelse[];
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
};
