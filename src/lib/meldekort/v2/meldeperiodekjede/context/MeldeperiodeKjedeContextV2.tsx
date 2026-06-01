import React, { createContext, useContext } from 'react';
import { MeldeperiodeKjedePropsV2 } from '~/lib/meldekort/typer/Meldeperiode';

type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
};

const MeldeperiodeKjedeContext = createContext<MeldeperioderContextState>(
    {} as MeldeperioderContextState,
);

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
    children: React.ReactNode;
};

export const MeldeperiodeKjedeV2Provider = ({ meldeperiodeKjede, children }: Props) => {
    return (
        <MeldeperiodeKjedeContext.Provider
            value={{
                meldeperiodeKjede,
            }}
        >
            {children}
        </MeldeperiodeKjedeContext.Provider>
    );
};

export const useMeldeperiodeKjedeV2 = () => {
    return useContext(MeldeperiodeKjedeContext);
};
