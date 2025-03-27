import { Periode } from '../Periode';
import { MeldekortBehandlingProps } from './MeldekortBehandling';
import { BrukersMeldekortProps } from './BrukersMeldekort';

type MeldeperiodeDato = `${number}-${number}-${number}`;

export type MeldeperiodeKjedeId = `${MeldeperiodeDato}/${MeldeperiodeDato}`;

export type MeldeperiodeId = `meldeperiode_${string}`;

export enum MeldeperiodeStatus {
    IKKE_RETT_TIL_TILTAKSPENGER = 'IKKE_RETT_TIL_TILTAKSPENGER',
    IKKE_KLAR_TIL_UTFYLLING = 'IKKE_KLAR_TIL_UTFYLLING',
    VENTER_PÅ_UTFYLLING = 'VENTER_PÅ_UTFYLLING',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    GODKJENT = 'GODKJENT',
}

export type MeldeperiodeProps = {
    id: MeldeperiodeId;
    kjedeId: MeldeperiodeKjedeId;
    versjon: number;
    periode: Periode;
    opprettet: string;
    status: MeldeperiodeStatus;
    antallDager: number;
    girRett: Record<string, boolean>;
    meldekortBehandlinger: MeldekortBehandlingProps[];
    brukersMeldekort?: BrukersMeldekortProps;
};

export type MeldeperiodeKjedeProps = {
    kjedeId: MeldeperiodeKjedeId;
    periode: Periode;
    tiltaksnavn?: string[];
    meldeperioder: MeldeperiodeProps[];
    begrunnelse?: string;
};
