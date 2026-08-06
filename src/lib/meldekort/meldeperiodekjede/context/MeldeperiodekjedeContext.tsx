import React, { createContext, useContext } from 'react';

import { MeldeperiodekjedeProps } from '~/lib/meldekort/typer/Meldeperiodekjede';

type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodekjedeProps;
};

const MeldeperiodekjedeContext = createContext<MeldeperioderContextState>(
    {} as MeldeperioderContextState,
);

type Props = {
    meldeperiodeKjede: MeldeperiodekjedeProps;
    children: React.ReactNode;
};

export const MeldeperiodekjedeProvider = ({ meldeperiodeKjede, children }: Props) => {
    return (
        <MeldeperiodekjedeContext.Provider
            value={{
                meldeperiodeKjede,
            }}
        >
            {children}
        </MeldeperiodekjedeContext.Provider>
    );
};

export const useMeldeperiodekjede = () => {
    return useContext(MeldeperiodekjedeContext);
};
