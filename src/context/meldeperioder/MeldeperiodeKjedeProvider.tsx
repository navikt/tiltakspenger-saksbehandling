import React, { useCallback, useState } from 'react';
import { MeldeperiodeKjedeContext } from './MeldeperiodeKjedeContext';
import { MeldeperiodeId, MeldeperiodeKjedeProps } from '../../types/meldekort/Meldeperiode';
import Varsel from '../../components/varsel/Varsel';
import { MeldekortBehandlingProps } from '../../types/meldekort/MeldekortBehandling';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    children: React.ReactNode;
};

export const MeldeperiodeKjedeProvider = ({
    meldeperiodeKjede: meldeperiodeKjedeInitial,
    children,
}: Props) => {
    const [meldeperiodeKjede, setMeldeperiodeKjede] = useState(meldeperiodeKjedeInitial);

    // TODO: selector komponent for å velge blant flere instanser av meldeperioden
    const valgtMeldeperiode = meldeperiodeKjede.meldeperioder[0];

    const setMeldekortbehandling = useCallback(
        (id: MeldeperiodeId, behandling: MeldekortBehandlingProps) => {
            setMeldeperiodeKjede({
                ...meldeperiodeKjede,
                meldeperioder: meldeperiodeKjede.meldeperioder.map((meldeperiode) =>
                    meldeperiode.id === id
                        ? { ...meldeperiode, meldekortBehandling: behandling }
                        : meldeperiode,
                ),
            });
        },
        [meldeperiodeKjede],
    );

    if (!valgtMeldeperiode) {
        return (
            <Varsel
                variant="error"
                melding={`Fant ingen meldeperioder for ${meldeperiodeKjede.kjedeId}`}
            />
        );
    }

    return (
        <MeldeperiodeKjedeContext.Provider
            value={{
                meldeperiodeKjede,
                valgtMeldeperiode,
                setMeldekortbehandling,
            }}
        >
            {children}
        </MeldeperiodeKjedeContext.Provider>
    );
};
