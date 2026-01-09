import { useCallback } from 'react';
import {
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingDTO,
    MeldekortBehandlingProps,
    MeldekortDagBeregnetProps,
    MeldekortDagProps,
} from '~/types/meldekort/MeldekortBehandling';
import {
    BrukersMeldekortDagStatus,
    BrukersMeldekortProps,
} from '~/types/meldekort/BrukersMeldekort';
import { MeldeperiodeProps } from '~/types/meldekort/Meldeperiode';
import { formaterDatotekst } from '~/utils/date';
import { Nullable } from '~/types/UtilTypes';
import { GyldigeMeldekortDagUfyllingsvalg } from '~/components/meldekort/0-felles-komponenter/uker/MeldekortUkeBehandling';
import { FieldErrors } from 'react-hook-form';

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
        },
    );
};

export const useCustomMeldekortUtfyllingValidationResolver = () =>
    useCallback(meldekortUtfyllingValidation, []);

export const meldekortUtfyllingValidation = (
    data: MeldekortBehandlingForm,
    valideringscontext: { tillattAntallDager: number },
) => {
    const errors: FieldErrors<MeldekortBehandlingForm> = {};

    if (tellDagerMedDeltattEllerFravær(data.dager) > valideringscontext.tillattAntallDager) {
        errors['dager'] = {
            type: 'dager',
            message: `For mange dager utfylt - Maks ${valideringscontext.tillattAntallDager} dager med tiltak for denne perioden.`,
        };
    }

    data.dager.forEach((dag, index) => {
        /*
                Denne er fordi vi teller med dagene som saksbehandler ikke skal få lov til å endre
                slik at feilmeldingene blir mappet til den riktige indeksen.
                */
        if (dag.status === MeldekortBehandlingDagStatus.IkkeRettTilTiltakspenger) {
            return;
        }

        if (!GyldigeMeldekortDagUfyllingsvalg.includes(dag.status)) {
            //erorr objektet vårt må bygges opp dynamisk for å matche react-hook-form sitt format
            errors.dager = errors.dager ?? [];
            errors.dager[index] = errors.dager[index] ?? {};

            errors['dager'][index]['status'] = {
                type: `dager.${index}.status`,
                message: `Ugyldig status valgt for dag ${formaterDatotekst(dag.dato)}`,
            };
        }
    });

    return { values: data, errors: errors };
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
    begrunnelse: string;
    tekstTilVedtaksbrev: string;
};

export interface ForhåndsvisMeldekortbehandlingBrevRequest {
    dager: Nullable<MeldekortDagProps[]>;
    tekstTilVedtaksbrev: Nullable<string>;
}

export const meldekortBehandlingFormTilDto = (
    data: MeldekortBehandlingForm,
): MeldekortBehandlingDTO => ({
    dager: data.dager,
    begrunnelse: data.begrunnelse.trim() || null,
    tekstTilVedtaksbrev: data.tekstTilVedtaksbrev.trim() || null,
});
