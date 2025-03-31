import { Periode } from '../Periode';
import { MeldekortBehandlingProps } from './MeldekortBehandling';
import { BrukersMeldekortProps } from './BrukersMeldekort';

type MeldeperiodeDato = `${number}-${number}-${number}`;

export type MeldeperiodeKjedeId = `${MeldeperiodeDato}/${MeldeperiodeDato}`;

export type MeldeperiodeId = `meldeperiode_${string}`;

export enum MeldeperiodeKjedeStatus {
    IKKE_RETT_TIL_TILTAKSPENGER = 'IKKE_RETT_TIL_TILTAKSPENGER',
    IKKE_KLAR_TIL_BEHANDLING = 'IKKE_KLAR_TIL_BEHANDLING',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    UNDER_KORRIGERING = 'UNDER_KORRIGERING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    GODKJENT = 'GODKJENT',
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
    brukersMeldekort?: BrukersMeldekortProps;
};
