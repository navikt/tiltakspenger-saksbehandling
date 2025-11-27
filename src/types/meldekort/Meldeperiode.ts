import { Periode } from '../Periode';
import { MeldekortBehandlingId, MeldekortBehandlingProps } from './MeldekortBehandling';
import { BrukersMeldekortProps } from './BrukersMeldekort';

import { MeldeperiodeBeregningProps } from '~/types/Beregning';

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
};

export type MeldeperiodeKjedeProps = {
    id: MeldeperiodeKjedeId;
    periode: Periode;
    status: MeldeperiodeKjedeStatus;
    periodeMedÅpenBehandling?: Periode;
    tiltaksnavn: string[];
    meldeperioder: MeldeperiodeProps[];
    meldekortBehandlinger: MeldekortBehandlingProps[];
    brukersMeldekort: BrukersMeldekortProps[];
    korrigeringFraTidligerePeriode?: MeldeperiodeKorrigering;
    avbrutteMeldekortBehandlinger: MeldekortBehandlingProps[];
    sisteBeregning: MeldeperiodeBeregningProps;
};

export type MeldeperiodeKorrigering = {
    meldekortId: MeldekortBehandlingId;
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    iverksatt: string;
    beregning: MeldeperiodeBeregningProps;
};
