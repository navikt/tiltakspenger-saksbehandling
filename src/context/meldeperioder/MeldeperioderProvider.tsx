import React from 'react';
import { MeldeperioderContext } from './MeldeperioderContext';
import { MeldeperiodeKjedeProps, MeldeperiodeProps } from '../../types/meldekort/Meldeperiode';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    valgtMeldeperiode: MeldeperiodeProps;
    children: React.ReactNode;
};

export const MeldeperioderProvider = ({
    meldeperiodeKjede,
    valgtMeldeperiode,
    children,
}: Props) => {
    return (
        <MeldeperioderContext.Provider
            value={{
                meldeperiodeKjede,
                valgtMeldeperiode,
            }}
        >
            {children}
        </MeldeperioderContext.Provider>
    );
};
