import {
    MeldekortDagProps,
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingProps,
    MeldekortDagBeregnetProps,
} from '../../../../../types/meldekort/MeldekortBehandling';
import {
    BrukersMeldekortDagStatus,
    BrukersMeldekortProps,
} from '../../../../../types/meldekort/BrukersMeldekort';

export const hentMeldekortForhåndsutfylling = (
    meldekortBehandling: MeldekortBehandlingProps,
    tidligereBehandlinger: MeldekortBehandlingProps[],
    brukersMeldekort?: BrukersMeldekortProps,
): MeldekortDagBeregnetProps[] => {
    if (meldekortBehandling.beregning) {
        return hentMeldekortDager(meldekortBehandling);
    }

    const forrigeBehandling = tidligereBehandlinger.at(0);

    if (forrigeBehandling) {
        return hentMeldekortDager(forrigeBehandling);
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

    return meldekortBehandling.dager;
};

const hentMeldekortDager = (meldekortBehandling: MeldekortBehandlingProps) =>
    meldekortBehandling.beregning?.beregningForMeldekortetsPeriode.dager ??
    meldekortBehandling.dager;

const brukersStatusTilBehandlingsStatus: Record<
    BrukersMeldekortDagStatus,
    MeldekortBehandlingDagStatus
> = {
    [BrukersMeldekortDagStatus.DELTATT_UTEN_LØNN_I_TILTAKET]:
        MeldekortBehandlingDagStatus.DeltattUtenLønnITiltaket,
    [BrukersMeldekortDagStatus.DELTATT_MED_LØNN_I_TILTAKET]:
        MeldekortBehandlingDagStatus.DeltattMedLønnITiltaket,
    [BrukersMeldekortDagStatus.FRAVÆR_SYK]: MeldekortBehandlingDagStatus.FraværSyk,
    [BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN]: MeldekortBehandlingDagStatus.FraværSyktBarn,
    [BrukersMeldekortDagStatus.FRAVÆR_VELFERD_GODKJENT_AV_NAV]:
        MeldekortBehandlingDagStatus.FraværVelferdGodkjentAvNav,
    [BrukersMeldekortDagStatus.FRAVÆR_VELFERD_IKKE_GODKJENT_AV_NAV]:
        MeldekortBehandlingDagStatus.FraværVelferdIkkeGodkjentAvNav,
    [BrukersMeldekortDagStatus.IKKE_REGISTRERT]: MeldekortBehandlingDagStatus.IkkeDeltatt,
} as const;

export const tellDagerMedDeltattEllerFravær = (dager: MeldekortDagProps[]) =>
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
    dager: MeldekortDagProps[];
    begrunnelse?: string;
};
