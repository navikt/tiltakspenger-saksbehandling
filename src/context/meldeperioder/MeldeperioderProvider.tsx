import React from 'react';
import { MeldeperioderContext } from './MeldeperioderContext';
import { MeldeperiodeKjedeProps } from '../../types/meldekort/Meldeperiode';
import Varsel from '../../components/varsel/Varsel';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    children: React.ReactNode;
};

export const MeldeperioderProvider = ({ meldeperiodeKjede, children }: Props) => {
    // TODO: selector komponent for å velge blant flere instanser av meldeperioden
    const valgtMeldeperiode = meldeperiodeKjede.meldeperioder[0];

    if (!valgtMeldeperiode) {
        return (
            <Varsel
                variant="error"
                melding={`Fant ingen meldeperioder for ${meldeperiodeKjede.kjedeId}`}
            />
        );
    }

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
