import React from 'react';
import { MeldeperioderContext } from './MeldeperioderContext';
import {
    BrukersMeldekortDagStatus,
    BrukersMeldekortProps,
    MeldekortBehandlingStatus,
    MeldeperiodeKjedeProps,
    MeldeperiodeProps,
    MeldeperiodeStatus,
} from '../../../types/MeldekortTypes';

type Props = {
    meldeperiodeKjede: MeldeperiodeKjedeProps;
    valgtMeldeperiode: MeldeperiodeProps;
    children: React.ReactNode;
};

export const MeldeperioderProvider = ({
    meldeperiodeKjede,
    valgtMeldeperiode,
    children,
}: Props) => {
    return (
        <MeldeperioderContext.Provider
            value={{
                meldeperiodeKjede,
                valgtMeldeperiode,
            }}
        >
            {children}
        </MeldeperioderContext.Provider>
    );
};

const brukersMeldekortDummy = (meldeperiode: MeldeperiodeProps): BrukersMeldekortProps => ({
    id: 'asdf',
    mottatt: new Date().toLocaleDateString(),
    dager: [
        { dato: '2025-01-06', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-07', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-08', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-09', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-10', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-11', status: BrukersMeldekortDagStatus.IKKE_REGISTRERT },
        { dato: '2025-01-12', status: BrukersMeldekortDagStatus.IKKE_REGISTRERT },
        { dato: '2025-01-13', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-14', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-15', status: BrukersMeldekortDagStatus.DELTATT },
        { dato: '2025-01-16', status: BrukersMeldekortDagStatus.FRAVÆR_SYK },
        { dato: '2025-01-17', status: BrukersMeldekortDagStatus.FRAVÆR_SYK },
        { dato: '2025-01-18', status: BrukersMeldekortDagStatus.IKKE_REGISTRERT },
        { dato: '2025-01-19', status: BrukersMeldekortDagStatus.IKKE_REGISTRERT },
    ],
});

const dummyMeldeperiodeIkkebehandlet = (meldeperiode: MeldeperiodeProps): MeldeperiodeProps => ({
    ...meldeperiode,
    status: MeldeperiodeStatus.VENTER_PÅ_UTFYLLING,
    meldekortBehandling: undefined,
    brukersMeldekort: brukersMeldekortDummy(meldeperiode),
});

const dummyMeldeperiodeMedUtfylling = (meldeperiode: MeldeperiodeProps): MeldeperiodeProps => ({
    ...meldeperiode,
    status: MeldeperiodeStatus.KLAR_TIL_BEHANDLING,
    meldekortBehandling: {
        ...meldeperiode.meldekortBehandling,
        status: MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING,
    },
    brukersMeldekort: brukersMeldekortDummy(meldeperiode),
});
