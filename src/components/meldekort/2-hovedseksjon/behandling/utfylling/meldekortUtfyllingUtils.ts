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
import { MeldeperiodeProps } from '../../../../../types/meldekort/Meldeperiode';

const hentDagerFraBehandling = (meldekortBehandling: MeldekortBehandlingProps) =>
    meldekortBehandling.beregning?.beregningForMeldekortetsPeriode.dager ??
    meldekortBehandling.dager;

const hentDager = (
    meldekortBehandling: MeldekortBehandlingProps,
    tidligereBehandlinger: MeldekortBehandlingProps[],
    brukersMeldekort?: BrukersMeldekortProps,
): MeldekortDagBeregnetProps[] => {
    if (meldekortBehandling.beregning) {
        return hentDagerFraBehandling(meldekortBehandling);
    }

    const forrigeBehandling = tidligereBehandlinger.at(0);

    if (forrigeBehandling) {
        return hentDagerFraBehandling(forrigeBehandling);
    }

    if (brukersMeldekort) {
        return brukersMeldekort.dager.map((dag) => ({
            dato: dag.dato,
            status: brukersStatusTilBehandlingsStatus[dag.status],
        }));
    }

    return meldekortBehandling.dager;
};

export const hentMeldekortForhåndsutfylling = (
    meldekortBehandling: MeldekortBehandlingProps,
    tidligereBehandlinger: MeldekortBehandlingProps[],
    meldeperiode: MeldeperiodeProps,
    brukersMeldekort?: BrukersMeldekortProps,
): MeldekortDagBeregnetProps[] => {
    return hentDager(meldekortBehandling, tidligereBehandlinger, brukersMeldekort).map((dag) =>
        meldeperiode.girRett[dag.dato]
            ? dag
            : { ...dag, status: MeldekortBehandlingDagStatus.Sperret },
    );
};

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
    [BrukersMeldekortDagStatus.FRAVÆR_GODKJENT_AV_NAV]:
        MeldekortBehandlingDagStatus.FraværGodkjentAvNav,
    [BrukersMeldekortDagStatus.FRAVÆR_ANNET]: MeldekortBehandlingDagStatus.FraværAnnet,
    [BrukersMeldekortDagStatus.IKKE_BESVART]: MeldekortBehandlingDagStatus.IkkeBesvart,
} as const;

export const tellDagerMedDeltattEllerFravær = (dager: MeldekortDagProps[]) =>
    dager.filter((dag) => dagerMedDeltattEllerFravær.has(dag.status)).length;

const dagerMedDeltattEllerFravær: ReadonlySet<MeldekortBehandlingDagStatus> = new Set([
    MeldekortBehandlingDagStatus.DeltattUtenLønnITiltaket,
    MeldekortBehandlingDagStatus.DeltattMedLønnITiltaket,
    MeldekortBehandlingDagStatus.FraværSyk,
    MeldekortBehandlingDagStatus.FraværSyktBarn,
    MeldekortBehandlingDagStatus.FraværGodkjentAvNav,
    MeldekortBehandlingDagStatus.FraværAnnet,
]);

export type MeldekortBehandlingForm = {
    dager: MeldekortDagProps[];
    begrunnelse?: string;
};
