import { Periode } from '../Periode';
import {
    MeldekortBehandlingId,
    MeldekortBehandlingProps,
    MeldeperiodeBeregning,
} from './MeldekortBehandling';
import {
    BrukersMeldekortBehandletAutomatiskStatus,
    BrukersMeldekortProps,
} from './BrukersMeldekort';

type MeldeperiodeDato = `${number}-${number}-${number}`;

export type MeldeperiodeKjedeId = `${MeldeperiodeDato}/${MeldeperiodeDato}`;

export type MeldeperiodeId = `meldeperiode_${string}`;

export enum MeldeperiodeKjedeStatus {
    AVVENTER_MELDEKORT = 'AVVENTER_MELDEKORT',
    IKKE_RETT_TIL_TILTAKSPENGER = 'IKKE_RETT_TIL_TILTAKSPENGER',
    IKKE_KLAR_TIL_BEHANDLING = 'IKKE_KLAR_TIL_BEHANDLING',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
    GODKJENT = 'GODKJENT',
    AUTOMATISK_BEHANDLET = 'AUTOMATISK_BEHANDLET',
    AVBRUTT = 'AVBRUTT',
}

export type MeldeperiodeProps = {
    id: MeldeperiodeId;
    versjon: number;
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    opprettet: string;
    antallDager: number;
    girRett: Record<string, boolean>;
};

export type MeldeperiodeKjedeProps = {
    id: MeldeperiodeKjedeId;
    periode: Periode;
    status: MeldeperiodeKjedeStatus;
    behandletAutomatiskStatus?: BrukersMeldekortBehandletAutomatiskStatus;
    periodeMedÅpenBehandling?: Periode;
    tiltaksnavn: string[];
    meldeperioder: MeldeperiodeProps[];
    meldekortBehandlinger: MeldekortBehandlingProps[];
    brukersMeldekort?: BrukersMeldekortProps;
    korrigeringFraTidligerePeriode?: MeldeperiodeKorrigering;
    avbrutteMeldekortBehandlinger: MeldekortBehandlingProps[];
    sisteBeregning: MeldeperiodeBeregning;
};

export type MeldeperiodeKorrigering = {
    meldekortId: MeldekortBehandlingId;
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    iverksatt: string;
    beregning: MeldeperiodeBeregning;
};
