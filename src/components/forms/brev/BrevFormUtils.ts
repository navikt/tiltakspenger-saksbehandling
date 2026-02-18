import { FieldErrors } from 'react-hook-form';
import {
    ForhåndsvisBrevKlageRequest,
    Klagebehandling,
    KlagebehandlingResultat,
} from '~/types/Klage';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Nullable } from '~/types/UtilTypes';
import { formaterDatotekst } from '~/utils/date';

export interface BrevFormData {
    tekstfelter: Avsnitt[];
}

export interface Avsnitt {
    tittel: string;
    tekst: string;
}

export const brevFormValidation = (data: BrevFormData) => {
    const errors: FieldErrors<BrevFormData> = {};

    if (data.tekstfelter.length < 1) {
        errors.tekstfelter = {
            type: 'required',
            message: 'Du må legge til minst ett avsnitt i brevet',
        };
    }

    /*
    error objektet vårt må bygges opp dynamisk for å matche react-hook-form sitt format
    Vi vil da få feil på riktig avsnitt i listen
    */
    data.tekstfelter.forEach((avsnitt, index) => {
        if (avsnitt.tittel.trim().length === 0) {
            errors.tekstfelter = errors.tekstfelter ?? [];
            errors.tekstfelter[index] = errors.tekstfelter[index] ?? {};

            errors.tekstfelter[index]['tittel'] = {
                type: `tekstfelter.${index}.tittel`,
                message: 'Tittelen kan ikke være tom',
            };
        }

        if (avsnitt.tekst.trim().length === 0) {
            errors.tekstfelter = errors.tekstfelter ?? [];
            errors.tekstfelter[index] = errors.tekstfelter[index] ?? {};

            errors.tekstfelter[index]['tekst'] = {
                type: `tekstfelter.${index}.tekst`,
                message: 'Avsnittet kan ikke være tomt',
            };
        }
    });

    return { values: data, errors };
};

/**
 *
 * @param påKlagetVedtak påkrevd for å kunne fylle in default tekst i klagebrev for opprettholdelse. Kaster exception hvis man sender null ved opprettholdelse
 */
export const klageTilBrevFormData = (
    klage: Klagebehandling,
    påKlagetVedtak: Nullable<Rammevedtak>,
): BrevFormData => {
    return {
        tekstfelter:
            klage.brevtekst.length > 0
                ? klage.brevtekst
                : klage.resultat === KlagebehandlingResultat.OPPRETTHOLDT
                  ? [
                        {
                            tittel: 'Hva klagesaken gjelder',
                            tekst: `Vi viser til klage av ${formaterDatotekst(klage.innsendingsdato)} på vedtak av ${formaterDatotekst(påKlagetVedtak!.opprettet)} der <kort om resultatet i vedtaket>`,
                        },
                        { tittel: 'Klagers anførsler', tekst: '' },
                        { tittel: 'Vurdering av klagen', tekst: '' },
                    ]
                  : [{ tittel: '', tekst: '' }],
    };
};

export const brevFormDataTilForhåndsvisBrevKlageRequest = (
    data: BrevFormData,
): ForhåndsvisBrevKlageRequest => {
    return {
        tekstTilVedtaksbrev: data.tekstfelter.filter(
            (avsnitt) => avsnitt.tittel.trim().length > 0 && avsnitt.tekst.trim().length > 0,
        ),
    };
};

export const brevFormDataTilLagreBrevtekstKlageRequest = (
    data: BrevFormData,
): ForhåndsvisBrevKlageRequest => {
    return { tekstTilVedtaksbrev: data.tekstfelter };
};
