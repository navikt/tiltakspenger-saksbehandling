import { FieldErrors } from 'react-hook-form';
import { ForhåndsvisBrevKlageRequest, Klagebehandling } from '~/types/Klage';

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

export const klageTilBrevFormData = (klage: Klagebehandling): BrevFormData => {
    return {
        tekstfelter: klage.brevtekst.length > 0 ? klage.brevtekst : [{ tittel: '', tekst: '' }],
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
