import React, { createContext, useContext } from 'react';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { sorterMeldekortbehandlingerDesc } from '~/lib/meldekort/utils/MeldekortbehandlingUtils';
import { BrukersMeldekortProps } from '~/lib/meldekort/typer/BrukersMeldekort';

export type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    finnForrigeMeldekortbehandling: (
        meldekortId: MeldekortbehandlingId,
    ) => MeldekortbehandlingProps | undefined;
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

export const MeldeperiodeKjedeProvider = ({ meldeperiodeKjede, children }: Props) => {
    const { meldekortbehandlinger, avbrutteMeldekortbehandlinger } = meldeperiodeKjede;

    const alleMeldekortbehandlinger = meldekortbehandlinger.toSorted(
        sorterMeldekortbehandlingerDesc,
    );

    const [sisteMeldekortbehandling, ...tidligereMeldekortbehandlinger] = alleMeldekortbehandlinger;

    const finnForrigeMeldekortbehandling = (meldekortId: MeldekortbehandlingId) => {
        const index = alleMeldekortbehandlinger.findIndex((mbeh) => mbeh.id === meldekortId);
        return alleMeldekortbehandlinger.at(index + 1);
    };

    return (
        <MeldeperiodeKjedeContext.Provider
            value={{
                meldeperiodeKjede,
                finnForrigeMeldekortbehandling,
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
