import {
    MeldekortbehandlingDagStatus,
    MeldekortbehandlingProps,
    MeldekortDagBeregnetProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldeperiodeProps } from '~/lib/meldekort/typer/Meldeperiode';
import {
    BrukersMeldekortDagStatus,
    BrukersMeldekortProps,
} from '~/lib/meldekort/typer/BrukersMeldekort';

export const hentMeldekortForhåndsutfylling = (
    meldekortbehandling: MeldekortbehandlingProps,
    tidligereBehandlinger: MeldekortbehandlingProps[],
    meldeperiode: MeldeperiodeProps,
    brukersMeldekortForBehandling?: BrukersMeldekortProps,
): MeldekortDagBeregnetProps[] => {
    return oppdaterDagerForMeldeperiode(
        hentDager(meldekortbehandling, tidligereBehandlinger, brukersMeldekortForBehandling),
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
                dag.status === MeldekortbehandlingDagStatus.IkkeBesvart
                    ? MeldekortbehandlingDagStatus.IkkeTiltaksdag
                    : dag.status,
        })),
        sisteMeldeperiode,
    );
};

const hentDager = (
    meldekortbehandling: MeldekortbehandlingProps,
    tidligereBehandlinger: MeldekortbehandlingProps[],
    brukersMeldekortForBehandling?: BrukersMeldekortProps,
): MeldekortDagBeregnetProps[] => {
    if (meldekortbehandling.beregning) {
        return hentDagerFraBehandling(meldekortbehandling);
    }

    const forrigeBehandling = tidligereBehandlinger.at(0);

    if (forrigeBehandling) {
        return hentDagerFraBehandling(forrigeBehandling);
    }

    if (brukersMeldekortForBehandling) {
        return hentDagerFraBrukersmeldekort(brukersMeldekortForBehandling);
    }

    return meldekortbehandling.dager;
};

const hentDagerFraBehandling = (meldekortbehandling: MeldekortbehandlingProps) =>
    meldekortbehandling.beregning?.beregningForMeldekortetsPeriode.dager ??
    meldekortbehandling.dager;

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
                status: MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger,
            };
        }

        // Dersom forrige versjon av meldekortbehandlingen eller brukers meldekort ikke hadde rett på denne
        // dagen, men meldeperioden for siste vedtak gir rett, så nuller vi ut statusen
        if (harRett && dag.status === MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger) {
            return {
                ...dag,
                status: MeldekortbehandlingDagStatus.IkkeBesvart,
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
    MeldekortbehandlingDagStatus
> = {
    [BrukersMeldekortDagStatus.DELTATT_UTEN_LØNN_I_TILTAKET]:
        MeldekortbehandlingDagStatus.DeltattUtenLønnITiltaket,
    [BrukersMeldekortDagStatus.DELTATT_MED_LØNN_I_TILTAKET]:
        MeldekortbehandlingDagStatus.DeltattMedLønnITiltaket,
    [BrukersMeldekortDagStatus.FRAVÆR_SYK]: MeldekortbehandlingDagStatus.FraværSyk,
    [BrukersMeldekortDagStatus.FRAVÆR_SYKT_BARN]: MeldekortbehandlingDagStatus.FraværSyktBarn,
    [BrukersMeldekortDagStatus.FRAVÆR_STERKE_VELFERDSGRUNNER_ELLER_JOBBINTERVJU]:
        MeldekortbehandlingDagStatus.FraværSterkeVelferdsgrunnerEllerJobbintervju,
    [BrukersMeldekortDagStatus.FRAVÆR_GODKJENT_AV_NAV]:
        MeldekortbehandlingDagStatus.FraværGodkjentAvNav,
    [BrukersMeldekortDagStatus.FRAVÆR_ANNET]: MeldekortbehandlingDagStatus.FraværAnnet,
    [BrukersMeldekortDagStatus.IKKE_BESVART]: MeldekortbehandlingDagStatus.IkkeBesvart,
    [BrukersMeldekortDagStatus.IKKE_RETT_TIL_TILTAKSPENGER]:
        MeldekortbehandlingDagStatus.IkkeRettTilTiltakspenger,
    [BrukersMeldekortDagStatus.IKKE_TILTAKSDAG]: MeldekortbehandlingDagStatus.IkkeTiltaksdag,
} as const;
