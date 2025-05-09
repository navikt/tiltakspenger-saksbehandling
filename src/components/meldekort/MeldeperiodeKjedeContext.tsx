import React, { createContext, useContext, useEffect, useState } from 'react';
import { MeldeperiodeKjedeProps, MeldeperiodeProps } from '../../types/meldekort/Meldeperiode';
import {
    MeldekortBehandlingId,
    MeldekortBehandlingProps,
} from '../../types/meldekort/MeldekortBehandling';
import { sorterMeldekortBehandlingerAsc } from '../../utils/meldekort';

export type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    setMeldeperiodeKjede: (meldeperiodeKjede: MeldeperiodeKjedeProps) => void;
    finnForrigeMeldekortBehandling: (
        meldekortId: MeldekortBehandlingId,
    ) => MeldekortBehandlingProps | undefined;
    sisteMeldeperiode: MeldeperiodeProps;
    alleMeldekortBehandlinger: MeldekortBehandlingProps[];
    sisteMeldekortBehandling?: MeldekortBehandlingProps;
    tidligereMeldekortBehandlinger: MeldekortBehandlingProps[];
    avbrutteMeldekortBehandlinger: MeldekortBehandlingProps[];
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

    const { meldekortBehandlinger, avbrutteMeldekortBehandlinger } = meldeperiodeKjede;

    const sisteMeldeperiode = meldeperiodeKjede.meldeperioder.reduce((acc, meldeperiode) =>
        meldeperiode.versjon > acc.versjon ? meldeperiode : acc,
    );

    const alleMeldekortBehandlinger = meldekortBehandlinger.toSorted(
        sorterMeldekortBehandlingerAsc,
    );

    const [sisteMeldekortBehandling, ...tidligereMeldekortBehandlinger] = alleMeldekortBehandlinger;

    const finnForrigeMeldekortBehandling = (meldekortId: MeldekortBehandlingId) => {
        const index = alleMeldekortBehandlinger.findIndex((mbeh) => mbeh.id === meldekortId);
        return alleMeldekortBehandlinger.at(index + 1);
    };

    useEffect(() => {
        setMeldeperiodeKjede(meldeperiodeKjedeInitial);
    }, [meldeperiodeKjedeInitial]);

    return (
        <MeldeperiodeKjedeContext.Provider
            value={{
                meldeperiodeKjede,
                setMeldeperiodeKjede,
                finnForrigeMeldekortBehandling,
                sisteMeldeperiode,
                alleMeldekortBehandlinger,
                sisteMeldekortBehandling,
                tidligereMeldekortBehandlinger,
                avbrutteMeldekortBehandlinger,
            }}
        >
            {children}
        </MeldeperiodeKjedeContext.Provider>
    );
};

export const useMeldeperiodeKjede = () => {
    return useContext(MeldeperiodeKjedeContext);
};
