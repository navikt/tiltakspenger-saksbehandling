import { createContext } from 'react';
import {
    MeldeperiodeId,
    MeldeperiodeKjedeProps,
    MeldeperiodeProps,
} from '../../types/meldekort/Meldeperiode';
import { MeldekortBehandlingProps } from '../../types/meldekort/MeldekortBehandling';

export type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    valgtMeldeperiode: MeldeperiodeProps;
    setMeldekortbehandling: (
        meldeperiodeId: MeldeperiodeId,
        meldekortBehandling: MeldekortBehandlingProps,
    ) => void;
};

export const MeldeperiodeKjedeContext = createContext<MeldeperioderContextState>(
    {} as MeldeperioderContextState,
);
