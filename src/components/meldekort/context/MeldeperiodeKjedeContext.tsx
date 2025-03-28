import React, { createContext, useContext, useEffect, useState } from 'react';
import { MeldeperiodeKjedeProps, MeldeperiodeProps } from '../../../types/meldekort/Meldeperiode';
import { MeldekortBehandlingProps } from '../../../types/meldekort/MeldekortBehandling';
import { finnSisteMeldeperiodeVersjon } from '../../../utils/meldeperioder';

export type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    setMeldeperiodeKjede: (meldeperiodeKjede: MeldeperiodeKjedeProps) => void;
    sisteMeldeperiode: MeldeperiodeProps;
    sisteMeldekortBehandling?: MeldekortBehandlingProps;
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

    const { meldekortBehandlinger } = meldeperiodeKjede;

    const sisteMeldekortBehandling =
        meldekortBehandlinger.length > 0
            ? meldekortBehandlinger.reduce((acc, mbeh) =>
                  mbeh.opprettet > acc.opprettet ? mbeh : acc,
              )
            : undefined;

    const sisteMeldeperiode = finnSisteMeldeperiodeVersjon(meldeperiodeKjede);

    useEffect(() => {
        setMeldeperiodeKjede(meldeperiodeKjedeInitial);
    }, [meldeperiodeKjedeInitial]);

    return (
        <MeldeperiodeKjedeContext.Provider
            value={{
                meldeperiodeKjede,
                setMeldeperiodeKjede,
                sisteMeldeperiode,
                sisteMeldekortBehandling,
            }}
        >
            {children}
        </MeldeperiodeKjedeContext.Provider>
    );
};

export const useMeldeperiodeKjede = () => {
    return useContext(MeldeperiodeKjedeContext);
};
