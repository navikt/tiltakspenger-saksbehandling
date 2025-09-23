import {
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingProps,
    MeldekortDagBeregnetProps,
    MeldekortDagProps,
} from '~/types/meldekort/MeldekortBehandling';
import {
    BrukersMeldekortDagStatus,
    BrukersMeldekortProps,
} from '~/types/meldekort/BrukersMeldekort';
import { MeldeperiodeProps } from '~/types/meldekort/Meldeperiode';
import { erLørdagEllerSøndag } from '~/utils/date';

const hentDagerFraBehandling = (meldekortBehandling: MeldekortBehandlingProps) =>
    meldekortBehandling.beregning?.beregningForMeldekortetsPeriode.dager ??
    meldekortBehandling.dager;

const hentDager = (
    meldekortBehandling: MeldekortBehandlingProps,
    tidligereBehandlinger: MeldekortBehandlingProps[],
    brukersMeldekortForBehandling?: BrukersMeldekortProps,
): MeldekortDagBeregnetProps[] => {
    if (meldekortBehandling.beregning) {
        return hentDagerFraBehandling(meldekortBehandling);
    }

    const forrigeBehandling = tidligereBehandlinger.at(0);

    if (forrigeBehandling) {
        return hentDagerFraBehandling(forrigeBehandling);
    }

    if (brukersMeldekortForBehandling) {
        return brukersMeldekortForBehandling.dager.map((dag) => ({
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
    brukersMeldekortForBehandling?: BrukersMeldekortProps,
): MeldekortDagBeregnetProps[] => {
    return hentDager(meldekortBehandling, tidligereBehandlinger, brukersMeldekortForBehandling).map(
        (dag) => {
            if (!meldeperiode.girRett[dag.dato]) {
                return {
                    ...dag,
                    status: MeldekortBehandlingDagStatus.IkkeRettTilTiltakspenger,
                };
            }

            // Pga bugs i OS ved utbetaling av helgedager kan vi ikke støtte dette ennå
            if (erLørdagEllerSøndag(dag.dato)) {
                return {
                    ...dag,
                    status: MeldekortBehandlingDagStatus.IkkeTiltaksdag,
                };
            }

            return dag;
        },
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
    [BrukersMeldekortDagStatus.IKKE_RETT_TIL_TILTAKSPENGER]:
        MeldekortBehandlingDagStatus.IkkeRettTilTiltakspenger,
    [BrukersMeldekortDagStatus.IKKE_TILTAKSDAG]: MeldekortBehandlingDagStatus.IkkeTiltaksdag,
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
