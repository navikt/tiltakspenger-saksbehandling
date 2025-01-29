import {
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingProps,
    MeldekortBehandlingDagProps,
} from '../../../../../types/meldekort/MeldekortBehandling';
import {
    BrukersMeldekortDagStatus,
    BrukersMeldekortProps,
} from '../../../../../types/meldekort/BrukersMeldekort';

export const hentMeldekortBehandlingDager = (
    meldekortBehandling: MeldekortBehandlingProps,
    brukersMeldekort?: BrukersMeldekortProps,
): MeldekortBehandlingDagProps[] => {
    if (brukersMeldekort) {
        return brukersMeldekort.dager.map((dag) => ({
            dato: dag.dato,
            status: brukersStatusTilBehandlingsStatus[dag.status],
        }));
    }

    return meldekortBehandling.dager.map((dag) => {
        return {
            dato: dag.dato,
            status: dag.status,
        };
    });
};

const brukersStatusTilBehandlingsStatus: Record<
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

export const tellDagerMedDeltattEllerFravær = (dager: MeldekortBehandlingDagProps[]) =>
    dager.filter((dag) => dagerMedDeltattEllerFravær.has(dag.status)).length;

const dagerMedDeltattEllerFravær: ReadonlySet<MeldekortBehandlingDagStatus> = new Set([
    MeldekortBehandlingDagStatus.DeltattUtenLønnITiltaket,
    MeldekortBehandlingDagStatus.DeltattMedLønnITiltaket,
    MeldekortBehandlingDagStatus.FraværSyk,
    MeldekortBehandlingDagStatus.FraværSyktBarn,
    MeldekortBehandlingDagStatus.FraværVelferdGodkjentAvNav,
    MeldekortBehandlingDagStatus.FraværVelferdIkkeGodkjentAvNav,
]);

export type MeldekortBehandlingForm = {
    uke1: MeldekortBehandlingDagProps[];
    uke2: MeldekortBehandlingDagProps[];
};
