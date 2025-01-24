import { createContext } from 'react';
import { MeldeperiodeKjedeProps, MeldeperiodeProps } from '../../types/MeldekortTypes';

export type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    valgtMeldeperiode: MeldeperiodeProps;
};

export const MeldeperioderContext = createContext<MeldeperioderContextState>({
    meldeperiodeKjede: undefined,
    valgtMeldeperiode: undefined,
});
