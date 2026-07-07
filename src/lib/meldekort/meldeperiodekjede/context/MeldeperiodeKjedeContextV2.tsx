import React, { createContext, useContext } from 'react';

import { MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiode';

type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodekjedeProps;
};

const MeldeperiodeKjedeContext = createContext<MeldeperioderContextState>(
    {} as MeldeperioderContextState,
);

type Props = {
    meldeperiodeKjede: MeldeperiodekjedeProps;
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
