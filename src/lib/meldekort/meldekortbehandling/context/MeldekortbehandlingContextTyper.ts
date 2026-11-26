import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { TextAreaInput } from '~/lib/_felles/fritekst/fritekstUtils';
import { ReducerAction } from '~/types/ReducerAction';
import {
    MeldeperiodeKjedeId,
    MeldeperiodekjedeProps,
} from '~/lib/meldekort/typer/Meldeperiodekjede';
import { Dato } from '~/types/DatoTid';

export type MeldekortDagSkjema = {
    dato: Dato;
    status: MeldekortbehandlingDagStatus;
};

export type MeldeperiodeSkjema = {
    dager: MeldekortDagSkjema[];
    kjedeId: MeldeperiodeKjedeId;
};

export type MeldekortbehandlingSkjemaState = {
    meldeperioder: MeldeperiodeSkjema[];
    skalJournalføreVedtaksbrev: boolean;
    skalDistribuereVedtaksbrev: boolean;
    skalJournalføreNotat: boolean;
    erPrioritert: boolean;
};

export type MeldekortbehandlingSkjemaContext = MeldekortbehandlingSkjemaState & {
    erReadonly: boolean;
    kanEndreSkalJournalføreNotat: boolean;
    kanEndreSkalJournalføreVedtaksbrev: boolean;
    kanEndreSkalDistribuereVedtaksbrev: boolean;
    begrunnelse: TextAreaInput;
    brevtekst: TextAreaInput;
    prioriteringBegrunnelse: TextAreaInput;
};

export type MeldekortbehandlingSkjemaActions =
    | ReducerAction<
          'oppdaterDagStatus',
          { kjedeId: MeldeperiodeKjedeId; dagIndex: number; status: MeldekortbehandlingDagStatus }
      >
    | ReducerAction<'setDager', MeldeperiodeSkjema>
    | ReducerAction<'setSkalJournalføreVedtaksbrev', { skalJournalføreVedtaksbrev: boolean }>
    | ReducerAction<'setSkalDistribuereVedtaksbrev', { skalDistribuereVedtaksbrev: boolean }>
    | ReducerAction<'setSkalJournalføreNotat', { skalJournalføreNotat: boolean }>
    | ReducerAction<'setErPrioritert', { erPrioritert: boolean }>
    | ReducerAction<'leggTilMeldeperioder', { meldeperiodeKjeder: MeldeperiodekjedeProps[] }>
    | ReducerAction<'fjernMeldeperiode', { kjedeId: MeldeperiodeKjedeId }>;
