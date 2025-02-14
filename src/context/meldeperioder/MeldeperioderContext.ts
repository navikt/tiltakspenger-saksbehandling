import { createContext } from 'react';
import { MeldeperiodeKjedeProps, MeldeperiodeProps } from '../../types/meldekort/Meldeperiode';

export type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    valgtMeldeperiode: MeldeperiodeProps;
};

export const MeldeperioderContext = createContext<MeldeperioderContextState>(
    {} as MeldeperioderContextState,
);
