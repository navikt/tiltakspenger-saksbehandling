import React, { createContext, useContext } from 'react';
import { MeldeperiodeKjedePropsV2, MeldeperiodeProps } from '~/lib/meldekort/typer/Meldeperiode';

type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
    sisteMeldeperiode: MeldeperiodeProps;
};

const MeldeperiodeKjedeContext = createContext<MeldeperioderContextState>(
    {} as MeldeperioderContextState,
);

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
    children: React.ReactNode;
};

export const MeldeperiodeKjedeV2Provider = ({ meldeperiodeKjede, children }: Props) => {
    const sisteMeldeperiode = meldeperiodeKjede.meldeperioder.at(-1)!;

    return (
        <MeldeperiodeKjedeContext.Provider
            value={{
                meldeperiodeKjede,
                sisteMeldeperiode,
            }}
        >
            {children}
        </MeldeperiodeKjedeContext.Provider>
    );
};

export const useMeldeperiodeKjedeV2 = () => {
    return useContext(MeldeperiodeKjedeContext);
};
