import React, { useCallback, useEffect, useState } from 'react';
import { MeldeperiodeKjedeContext } from './MeldeperiodeKjedeContext';
import {
    MeldeperiodeId,
    MeldeperiodeKjedeProps,
    MeldeperiodeStatus,
} from '../../../types/meldekort/Meldeperiode';
import Varsel from '../../varsel/Varsel';
import {
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
} from '../../../types/meldekort/MeldekortBehandling';

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
                        ? {
                              ...meldeperiode,
                              meldekortBehandling: behandling,
                              status: meldekortBehandlingStatusTilPeriodeStatus[behandling.status],
                          }
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

const meldekortBehandlingStatusTilPeriodeStatus: Record<
    MeldekortBehandlingStatus,
    MeldeperiodeStatus
> = {
    [MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING]: MeldeperiodeStatus.KLAR_TIL_BEHANDLING,
    [MeldekortBehandlingStatus.GODKJENT]: MeldeperiodeStatus.GODKJENT,
    [MeldekortBehandlingStatus.KLAR_TIL_BESLUTNING]: MeldeperiodeStatus.KLAR_TIL_BESLUTNING,
    [MeldekortBehandlingStatus.IKKE_RETT_TIL_TILTAKSPENGER]:
        MeldeperiodeStatus.IKKE_RETT_TIL_TILTAKSPENGER,
};
