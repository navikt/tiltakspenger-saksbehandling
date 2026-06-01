import { Periode } from '~/types/Periode';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
    MeldekortbehandlingStatus,
} from './Meldekortbehandling';
import { BrukersMeldekortKjedeStatus, BrukersMeldekortProps } from './BrukersMeldekort';
import { MeldeperiodeBeregningProps } from '~/lib/beregning-og-simulering/typer/Beregning';

type MeldeperiodeDato = `${number}-${number}-${number}`;

export type MeldeperiodeKjedeId = `${MeldeperiodeDato}/${MeldeperiodeDato}`;

export type MeldeperiodeId = `meldeperiode_${string}`;

export enum MeldeperiodeKjedeStatus {
    AVVENTER_MELDEKORT = 'AVVENTER_MELDEKORT',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
    GODKJENT = 'GODKJENT',
    AUTOMATISK_BEHANDLET = 'AUTOMATISK_BEHANDLET',
    IKKE_RETT_TIL_TILTAKSPENGER = 'IKKE_RETT_TIL_TILTAKSPENGER',
    IKKE_KLAR_TIL_BEHANDLING = 'IKKE_KLAR_TIL_BEHANDLING',
    AVBRUTT = 'AVBRUTT',
    KORRIGERT_MELDEKORT = 'KORRIGERT_MELDEKORT',
    VENTER_AUTOMATISK_BEHANDLING = 'VENTER_AUTOMATISK_BEHANDLING',
}

export type MeldeperiodeProps = {
    id: MeldeperiodeId;
    versjon: number;
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    opprettet: string;
    antallDager: number;
    girRett: Record<string, boolean>;
    ingenDagerGirRett: boolean;
};

export type MeldeperiodeKjedeProps = {
    id: MeldeperiodeKjedeId;
    periode: Periode;
    status: MeldeperiodeKjedeStatus;
    periodeMedÅpenBehandling?: Periode;
    tiltaksnavn: string[];
    sisteMeldeperiode: MeldeperiodeProps;
    meldekortbehandlinger: MeldekortbehandlingProps[];
    brukersMeldekort: BrukersMeldekortProps[];
    korrigeringFraTidligerePeriode?: MeldeperiodeKorrigering;
    avbrutteMeldekortbehandlinger: MeldekortbehandlingProps[];
    sisteBeregning: MeldeperiodeBeregningProps;
};

export type MeldeperiodeKorrigering = {
    meldekortId: MeldekortbehandlingId;
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    iverksatt: string;
    beregning: MeldeperiodeBeregningProps;
};

export type MeldeperiodeKjedePropsV2 = {
    id: MeldeperiodeKjedeId;
    periode: Periode;
    tiltaksnavn: string[];
    sisteMeldeperiode: MeldeperiodeProps;
    meldekortbehandlingIder: MeldekortbehandlingId[];
    meldekortbehandlingStatus: MeldekortbehandlingStatus | null;
    brukersMeldekort: BrukersMeldekortProps[];
    brukersMeldekortStatus: BrukersMeldekortKjedeStatus;
    gjeldendeBeregning: MeldeperiodeBeregningProps | null;
};
