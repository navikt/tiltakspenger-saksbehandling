import {
    BrukersMeldekortDagStatus,
    BrukersMeldekortProps,
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingProps,
    MeldekortBehandlingDag,
} from '../../../../types/MeldekortTypes';

export const hentUtfylteMeldekortDager = (
    meldekortBehandling: MeldekortBehandlingProps,
    brukersMeldekort?: BrukersMeldekortProps,
): MeldekortBehandlingDag[] => {
    if (brukersMeldekort) {
        return brukersMeldekort.dager.map((dag) => ({
            dato: dag.dato,
            status: brukersMeldekortDagTilBehandlingsDag[dag.status],
        }));
    }

    return meldekortBehandling.dager.map((dag) => {
        return {
            dato: dag.dato,
            status: dag.status,
        };
    });
};

const brukersMeldekortDagTilBehandlingsDag: Record<
    BrukersMeldekortDagStatus,
    MeldekortBehandlingDagStatus
> = {
    [BrukersMeldekortDagStatus.DELTATT]: MeldekortBehandlingDagStatus.DeltattUtenLønnITiltaket,
    [BrukersMeldekortDagStatus.FRAVÆR_SYK]: MeldekortBehandlingDagStatus.FraværSyk,
    [BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN]: MeldekortBehandlingDagStatus.FraværSyktBarn,
    [BrukersMeldekortDagStatus.FRAVÆR_ANNET]:
        MeldekortBehandlingDagStatus.FraværVelferdGodkjentAvNav,
    [BrukersMeldekortDagStatus.IKKE_REGISTRERT]: MeldekortBehandlingDagStatus.IkkeDeltatt,
    [BrukersMeldekortDagStatus.IKKE_RETT_TIL_TILTAKSPENGER]: MeldekortBehandlingDagStatus.Sperret,
} as const;
