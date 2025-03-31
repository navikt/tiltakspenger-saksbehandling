import React, { createContext, useContext, useEffect, useState } from 'react';
import { MeldeperiodeKjedeProps, MeldeperiodeProps } from '../../../types/meldekort/Meldeperiode';
import { MeldekortBehandlingProps } from '../../../types/meldekort/MeldekortBehandling';

export type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    setMeldeperiodeKjede: (meldeperiodeKjede: MeldeperiodeKjedeProps) => void;
    sisteMeldeperiode: MeldeperiodeProps;
    sisteMeldekortBehandling?: MeldekortBehandlingProps;
    tidligereMeldekortBehandlinger: MeldekortBehandlingProps[];
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

    const sisteMeldeperiode = meldeperiodeKjede.meldeperioder.reduce((acc, meldeperiode) =>
        meldeperiode.versjon > acc.versjon ? meldeperiode : acc,
    );

    const [sisteMeldekortBehandling, ...tidligereMeldekortBehandlinger] =
        meldekortBehandlinger.toSorted((a, b) => (a.opprettet > b.opprettet ? -1 : 1));

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
                tidligereMeldekortBehandlinger,
            }}
        >
            {children}
        </MeldeperiodeKjedeContext.Provider>
    );
};

export const useMeldeperiodeKjede = () => {
    return useContext(MeldeperiodeKjedeContext);
};
