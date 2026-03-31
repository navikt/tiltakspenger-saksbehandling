import React, { createContext, useContext, useEffect, useState } from 'react';
import { MeldeperiodeKjedeProps, MeldeperiodeProps } from '~/types/meldekort/Meldeperiode';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/types/meldekort/Meldekortbehandling';
import { sorterMeldekortbehandlingerAsc } from '~/utils/meldekort';
import { BrukersMeldekortProps } from '~/types/meldekort/BrukersMeldekort';

export type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    setMeldeperiodeKjede: (meldeperiodeKjede: MeldeperiodeKjedeProps) => void;
    finnForrigeMeldekortbehandling: (
        meldekortId: MeldekortbehandlingId,
    ) => MeldekortbehandlingProps | undefined;
    sisteMeldeperiode: MeldeperiodeProps;
    alleMeldekortbehandlinger: MeldekortbehandlingProps[];
    sisteMeldekortbehandling?: MeldekortbehandlingProps;
    tidligereMeldekortbehandlinger: MeldekortbehandlingProps[];
    avbrutteMeldekortbehandlinger: MeldekortbehandlingProps[];
    brukersMeldekort: BrukersMeldekortProps[];
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

    const { meldekortbehandlinger, avbrutteMeldekortbehandlinger } = meldeperiodeKjede;

    const sisteMeldeperiode = meldeperiodeKjede.meldeperioder.reduce((acc, meldeperiode) =>
        meldeperiode.versjon > acc.versjon ? meldeperiode : acc,
    );

    const alleMeldekortbehandlinger = meldekortbehandlinger.toSorted(
        sorterMeldekortbehandlingerAsc,
    );

    const [sisteMeldekortbehandling, ...tidligereMeldekortbehandlinger] = alleMeldekortbehandlinger;

    const finnForrigeMeldekortbehandling = (meldekortId: MeldekortbehandlingId) => {
        const index = alleMeldekortbehandlinger.findIndex((mbeh) => mbeh.id === meldekortId);
        return alleMeldekortbehandlinger.at(index + 1);
    };

    useEffect(() => {
        setMeldeperiodeKjede(meldeperiodeKjedeInitial);
    }, [meldeperiodeKjedeInitial]);

    return (
        <MeldeperiodeKjedeContext.Provider
            value={{
                meldeperiodeKjede,
                setMeldeperiodeKjede,
                finnForrigeMeldekortbehandling,
                sisteMeldeperiode,
                alleMeldekortbehandlinger,
                sisteMeldekortbehandling,
                tidligereMeldekortbehandlinger,
                avbrutteMeldekortbehandlinger: avbrutteMeldekortbehandlinger,
                brukersMeldekort: meldeperiodeKjede.brukersMeldekort,
            }}
        >
            {children}
        </MeldeperiodeKjedeContext.Provider>
    );
};

export const useMeldeperiodeKjede = () => {
    return useContext(MeldeperiodeKjedeContext);
};
