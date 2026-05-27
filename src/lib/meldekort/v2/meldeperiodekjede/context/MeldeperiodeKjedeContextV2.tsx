import React, { createContext, useContext } from 'react';
import { MeldeperiodeKjedePropsV2, MeldeperiodeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { useResettableState } from '~/hooks/useResettableState';

type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
    setMeldeperiodeKjede: (meldeperiodeKjede: MeldeperiodeKjedePropsV2) => void;
    sisteMeldeperiode: MeldeperiodeProps;
};

const MeldeperiodeKjedeContext = createContext<MeldeperioderContextState>(
    {} as MeldeperioderContextState,
);

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedePropsV2;
    children: React.ReactNode;
};

export const MeldeperiodeKjedeV2Provider = ({
    meldeperiodeKjede: meldeperiodeKjedeInitial,
    children,
}: Props) => {
    const [meldeperiodeKjede, setMeldeperiodeKjede] = useResettableState(meldeperiodeKjedeInitial);

    const sisteMeldeperiode = meldeperiodeKjede.meldeperioder.at(-1)!;

    return (
        <MeldeperiodeKjedeContext.Provider
            value={{
                meldeperiodeKjede,
                setMeldeperiodeKjede,
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
