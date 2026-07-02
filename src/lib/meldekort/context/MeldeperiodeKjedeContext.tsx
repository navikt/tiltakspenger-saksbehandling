import React, { createContext, useContext } from 'react';
import { MeldeperiodeKjedeId, MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { sorterMeldekortbehandlingerDesc } from '~/lib/meldekort/utils/MeldekortbehandlingUtils';
import { BrukersMeldekortProps } from '~/lib/meldekort/typer/BrukersMeldekort';
import { useSak } from '~/lib/sak/SakContext';

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
    kjedeId: MeldeperiodeKjedeId;
    children: React.ReactNode;
};

export const MeldeperiodeKjedeProvider = ({ kjedeId, children }: Props) => {
    const { sak } = useSak();

    const meldeperiodeKjede = sak.meldeperiodeKjeder.find((it) => it.id === kjedeId);

    if (!meldeperiodeKjede) {
        throw Error(`Fant ikke meldeperiodekjeden med id ${kjedeId} på sak ${sak.sakId}`);
    }

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
