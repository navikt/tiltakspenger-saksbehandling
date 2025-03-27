import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
    MeldeperiodeId,
    MeldeperiodeKjedeProps,
    MeldeperiodeProps,
} from '../../../types/meldekort/Meldeperiode';
import { MeldekortBehandlingProps } from '../../../types/meldekort/MeldekortBehandling';
import {
    finnSisteMeldeperiodeVersjon,
    meldekortBehandlingStatusTilMeldeperiodeStatus,
} from '../../../utils/meldeperioder';
import Varsel from '../../varsel/Varsel';

export type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    valgtMeldeperiode: MeldeperiodeProps;
    setMeldekortbehandling: (
        meldeperiodeId: MeldeperiodeId,
        meldekortBehandling: MeldekortBehandlingProps,
    ) => void;
};

export const MeldeperiodeKjedeContext = createContext<MeldeperioderContextState>(
    {} as MeldeperioderContextState,
);

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
    const valgtMeldeperiode = finnSisteMeldeperiodeVersjon(meldeperiodeKjede);

    const setMeldekortbehandling = useCallback(
        (id: MeldeperiodeId, nyBehandling: MeldekortBehandlingProps) => {
            setMeldeperiodeKjede({
                ...meldeperiodeKjede,
                meldeperioder: meldeperiodeKjede.meldeperioder.map((meldeperiode) =>
                    meldeperiode.id === id
                        ? ({
                              ...meldeperiode,
                              meldekortBehandlinger: meldeperiode.meldekortBehandlinger.map(
                                  (beh) => (beh.id === nyBehandling.id ? nyBehandling : beh),
                              ),
                              status: meldekortBehandlingStatusTilMeldeperiodeStatus[
                                  nyBehandling.status
                              ],
                          } satisfies MeldeperiodeProps)
                        : meldeperiode,
                ),
            });
        },
        [meldeperiodeKjede],
    );

    useEffect(() => {
        setMeldeperiodeKjede(meldeperiodeKjedeInitial);
    }, [meldeperiodeKjedeInitial]);

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

export const useMeldeperiodeKjede = () => {
    return useContext(MeldeperiodeKjedeContext);
};
