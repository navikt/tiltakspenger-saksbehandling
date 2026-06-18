import {
    MeldekortbehandlingDagStatus,
    OppdaterMeldekortbehandlingDTO,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { TextAreaInput } from '~/utils/textarea';
import { ReducerAction } from '~/types/ReducerAction';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/v2/typer';

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
    | ReducerAction<'setDager', MeldeperiodeSkjema>
    | ReducerAction<'setSkalSendeVedtaksbrev', { skalSendeVedtaksbrev: boolean }>
    | ReducerAction<'leggTilMeldeperiode', { meldeperiodeKjede: MeldeperiodeKjedePropsV2 }>
    | ReducerAction<'fjernMeldeperiode', { kjedeId: MeldeperiodeKjedeId }>;
