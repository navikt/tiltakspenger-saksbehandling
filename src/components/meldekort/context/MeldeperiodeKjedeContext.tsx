import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MeldeperiodeKjedeProps, MeldeperiodeProps } from '../../../types/meldekort/Meldeperiode';
import { MeldekortBehandlingProps } from '../../../types/meldekort/MeldekortBehandling';
import {
    finnSisteMeldeperiodeVersjon,
    meldekortBehandlingStatusTilMeldeperiodeStatus,
} from '../../../utils/meldeperioder';

export type MeldeperioderContextState = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    sisteMeldeperiode: MeldeperiodeProps;
    sisteMeldekortBehandling?: MeldekortBehandlingProps;
    oppdaterMeldekortBehandling: (meldekortBehandling: MeldekortBehandlingProps) => void;
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

    const sisteMeldekortBehandling = meldekortBehandlinger.reduce((acc, mbeh) =>
        mbeh.opprettet > acc.opprettet ? mbeh : acc,
    );

    const sisteMeldeperiode = finnSisteMeldeperiodeVersjon(meldeperiodeKjede);

    const oppdaterMeldekortBehandling = useCallback(
        (oppdatertBehandling: MeldekortBehandlingProps) => {
            const behandlinger = meldeperiodeKjede.meldekortBehandlinger;
            const behandlingIndex = behandlinger.findIndex(
                (behandling) => behandling.id == oppdatertBehandling.id,
            );

            setMeldeperiodeKjede({
                ...meldeperiodeKjede,
                status: meldekortBehandlingStatusTilMeldeperiodeStatus[oppdatertBehandling.status],
                meldekortBehandlinger:
                    behandlingIndex === -1
                        ? [...behandlinger, oppdatertBehandling]
                        : behandlinger.with(behandlingIndex, oppdatertBehandling),
            });
        },
        [meldeperiodeKjede],
    );

    useEffect(() => {
        setMeldeperiodeKjede(meldeperiodeKjedeInitial);
    }, [meldeperiodeKjedeInitial]);

    return (
        <MeldeperiodeKjedeContext.Provider
            value={{
                meldeperiodeKjede,
                sisteMeldeperiode,
                sisteMeldekortBehandling,
                oppdaterMeldekortBehandling,
            }}
        >
            {children}
        </MeldeperiodeKjedeContext.Provider>
    );
};

export const useMeldeperiodeKjede = () => {
    return useContext(MeldeperiodeKjedeContext);
};
