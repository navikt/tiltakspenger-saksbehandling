import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { TextAreaInput } from '~/lib/_felles/fritekst/fritekstUtils';
import { ReducerAction } from '~/types/ReducerAction';
import {
    MeldeperiodeKjedeId,
    MeldeperiodekjedeProps,
} from '~/lib/meldekort/typer/Meldeperiodekjede';

export type MeldekortDagSkjema = {
    dato: string;
    status: MeldekortbehandlingDagStatus;
};

export type MeldeperiodeSkjema = {
    dager: MeldekortDagSkjema[];
    kjedeId: MeldeperiodeKjedeId;
};

export type MeldekortbehandlingSkjemaState = {
    meldeperioder: MeldeperiodeSkjema[];
    skalSendeVedtaksbrev: boolean;
    skalJournalføreNotat: boolean;
    erPrioritert: boolean;
};

export type MeldekortbehandlingSkjemaContext = MeldekortbehandlingSkjemaState & {
    erReadonly: boolean;
    /** Beslutter kan endre valget om journalføring av notat selv om resten av skjemaet er låst. */
    kanEndreSkalJournalføreNotat: boolean;
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
    | ReducerAction<'setSkalSendeVedtaksbrev', { skalSendeVedtaksbrev: boolean }>
    | ReducerAction<'setSkalJournalføreNotat', { skalJournalføreNotat: boolean }>
    | ReducerAction<'setErPrioritert', { erPrioritert: boolean }>
    | ReducerAction<'leggTilMeldeperioder', { meldeperiodeKjeder: MeldeperiodekjedeProps[] }>
    | ReducerAction<'fjernMeldeperiode', { kjedeId: MeldeperiodeKjedeId }>;
