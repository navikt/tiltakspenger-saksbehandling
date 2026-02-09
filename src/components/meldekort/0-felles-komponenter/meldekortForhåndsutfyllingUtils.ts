import {
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingProps,
    MeldekortDagBeregnetProps,
} from '~/types/meldekort/MeldekortBehandling';
import { MeldeperiodeProps } from '~/types/meldekort/Meldeperiode';
import {
    BrukersMeldekortDagStatus,
    BrukersMeldekortProps,
} from '~/types/meldekort/BrukersMeldekort';

export const hentMeldekortForhåndsutfylling = (
    meldekortBehandling: MeldekortBehandlingProps,
    tidligereBehandlinger: MeldekortBehandlingProps[],
    meldeperiode: MeldeperiodeProps,
    brukersMeldekortForBehandling?: BrukersMeldekortProps,
): MeldekortDagBeregnetProps[] => {
    return oppdaterDagerForMeldeperiode(
        hentDager(meldekortBehandling, tidligereBehandlinger, brukersMeldekortForBehandling),
        meldeperiode,
    );
};

// Henter fullstendig forhåndsutfylling av meldekortdager basert på brukers meldekort
// Mapper "ikke besvart" til "ikke tiltaksdag"
export const hentMeldekortForhåndsutfyllingFraBrukersMeldekort = (
    brukersMeldekort: BrukersMeldekortProps,
    sisteMeldeperiode: MeldeperiodeProps,
) => {
    return oppdaterDagerForMeldeperiode(
        hentDagerFraBrukersmeldekort(brukersMeldekort).map((dag) => ({
            ...dag,
            status:
                dag.status === MeldekortBehandlingDagStatus.IkkeBesvart
                    ? MeldekortBehandlingDagStatus.IkkeTiltaksdag
                    : dag.status,
        })),
        sisteMeldeperiode,
    );
};

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
        return hentDagerFraBrukersmeldekort(brukersMeldekortForBehandling);
    }

    return meldekortBehandling.dager;
};

const hentDagerFraBehandling = (meldekortBehandling: MeldekortBehandlingProps) =>
    meldekortBehandling.beregning?.beregningForMeldekortetsPeriode.dager ??
    meldekortBehandling.dager;

// Oppdaterer dagene på meldekortet ut fra hvorvidt de gir rett i angitt meldeperiode
const oppdaterDagerForMeldeperiode = (
    dager: MeldekortDagBeregnetProps[],
    meldeperiode: MeldeperiodeProps,
): MeldekortDagBeregnetProps[] => {
    return dager.map((dag) => {
        const harRett = meldeperiode.girRett[dag.dato];

        if (!harRett) {
            return {
                ...dag,
                status: MeldekortBehandlingDagStatus.IkkeRettTilTiltakspenger,
            };
        }

        // Dersom forrige versjon av meldekortbehandlingen eller brukers meldekort ikke hadde rett på denne
        // dagen, men meldeperioden for siste vedtak gir rett, så nuller vi ut statusen
        if (harRett && dag.status === MeldekortBehandlingDagStatus.IkkeRettTilTiltakspenger) {
            return {
                ...dag,
                status: MeldekortBehandlingDagStatus.IkkeBesvart,
            };
        }

        return dag;
    });
};

const hentDagerFraBrukersmeldekort = (
    brukersMeldekortForBehandling: BrukersMeldekortProps,
): MeldekortDagBeregnetProps[] => {
    return brukersMeldekortForBehandling.dager.map((dag) => ({
        dato: dag.dato,
        status: brukersStatusTilBehandlingsStatus[dag.status],
    }));
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
