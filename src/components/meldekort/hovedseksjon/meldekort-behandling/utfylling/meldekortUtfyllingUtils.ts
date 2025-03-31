import {
    MeldekortBehandlingDagBeregnet,
    MeldekortBehandlingDagProps,
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingProps,
    MeldekortBehandlingStatus,
} from '../../../../../types/meldekort/MeldekortBehandling';
import {
    BrukersMeldekortDagStatus,
    BrukersMeldekortProps,
} from '../../../../../types/meldekort/BrukersMeldekort';

const fraBeregnetDag = (dag: MeldekortBehandlingDagBeregnet): MeldekortBehandlingDagProps => {
    return {
        dato: dag.dato,
        status: dag.status,
    };
};

export const hentMeldekortForhåndsutfylling = (
    meldekortBehandling: MeldekortBehandlingProps,
    tidligereBehandlinger: MeldekortBehandlingProps[],
    brukersMeldekort?: BrukersMeldekortProps,
): MeldekortBehandlingDagProps[] => {
    const forrigeBehandling = tidligereBehandlinger.at(0);

    if (
        meldekortBehandling.status === MeldekortBehandlingStatus.KLAR_TIL_UTFYLLING &&
        forrigeBehandling
    ) {
        return forrigeBehandling.dager.map(fraBeregnetDag);
    }

    if (brukersMeldekort) {
        return brukersMeldekort.dager.map((dag, index) => ({
            dato: dag.dato,
            status:
                meldekortBehandling.dager[index].status === MeldekortBehandlingDagStatus.Sperret
                    ? MeldekortBehandlingDagStatus.Sperret
                    : brukersStatusTilBehandlingsStatus[dag.status],
        }));
    }

    return meldekortBehandling.dager.map(fraBeregnetDag);
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
    [BrukersMeldekortDagStatus.IKKE_DELTATT]:
        MeldekortBehandlingDagStatus.FraværVelferdIkkeGodkjentAvNav,
    [BrukersMeldekortDagStatus.IKKE_REGISTRERT]: MeldekortBehandlingDagStatus.IkkeDeltatt,
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
    begrunnelse?: string;
};
