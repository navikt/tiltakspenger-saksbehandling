import { useCallback } from 'react';
import {
    MeldekortBehandlingDagStatus,
    MeldekortBehandlingDTO,
    MeldekortDagProps,
} from '~/types/meldekort/MeldekortBehandling';
import { formaterDatotekst } from '~/utils/date';
import { Nullable } from '~/types/UtilTypes';
import { GyldigeMeldekortDagUfyllingsvalg } from '~/components/meldekort/0-felles-komponenter/uker/MeldekortUkeBehandling';
import { FieldErrors } from 'react-hook-form';

export const useCustomMeldekortUtfyllingValidationResolver = () =>
    useCallback(
        (data: MeldekortBehandlingForm, valideringscontext: { tillattAntallDager: number }) =>
            meldekortUtfyllingValidation(data, valideringscontext),
        [],
    );

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
