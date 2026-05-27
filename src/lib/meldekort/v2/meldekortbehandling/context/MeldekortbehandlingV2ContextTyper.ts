import { MeldekortbehandlingDagStatus } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldeperiodeKjedeId, MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/typer/Meldeperiode';
import { TextAreaInput } from '~/utils/textarea';
import { ReducerAction } from '~/types/ReducerAction';

export type MeldekortDagContext = {
    dato: string;
    status: MeldekortbehandlingDagStatus;
};

export type MeldeperiodeContext = {
    dager: MeldekortDagContext[];
    kjedeId: MeldeperiodeKjedeId;
};

export type MeldekortbehandlingSkjemaState = {
    meldeperioder: MeldeperiodeContext[];
    skalSendeVedtaksbrev: boolean;
};

export type MeldekortbehandlingSkjemaContext = MeldekortbehandlingSkjemaState & {
    erReadonly: boolean;
    textAreas: {
        begrunnelse: TextAreaInput;
        brevtekst: TextAreaInput;
    };
};

export type MeldekortbehandlingSkjemaActions =
    | ReducerAction<
          'oppdaterDagStatus',
          { kjedeId: MeldeperiodeKjedeId; dagIndex: number; status: MeldekortbehandlingDagStatus }
      >
    | ReducerAction<'setSkalSendeVedtaksbrev', { skalSendeVedtaksbrev: boolean }>
    | ReducerAction<'leggTilMeldeperiode', { meldeperiodeKjede: MeldeperiodeKjedePropsV2 }>
    | ReducerAction<'fjernMeldeperiode', { index: number }>;
