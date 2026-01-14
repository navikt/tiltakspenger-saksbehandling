import { FieldErrors } from 'react-hook-form';
import { Klagebehandling, OpprettKlageRequest } from '~/types/Klage';
import { VedtakId } from '~/types/Rammevedtak';
import { Nullable } from '~/types/UtilTypes';
import { dateTilISOTekst } from '~/utils/date';

export const INGEN_VEDTAK = 'INGEN_VEDTAK' as const;

export interface FormkravFormData {
    journalpostId: string;
    mottattFraJournalpost: string;
    vedtakDetPåklages: typeof INGEN_VEDTAK | VedtakId | '';
    erKlagerPartISaken: Nullable<boolean>;
    klagesDetPåKonkreteElementer: Nullable<boolean>;
    erKlagefristOverholdt: Nullable<boolean>;
    erKlagenSignert: Nullable<boolean>;
}

export const formkravValidation = (data: FormkravFormData) => {
    const errors: FieldErrors<FormkravFormData> = {};

    if (!data.journalpostId) {
        errors.journalpostId = {
            type: 'required',
            message: 'Journalpost ID er påkrevd',
        };
    }

    if (!data.mottattFraJournalpost) {
        errors.mottattFraJournalpost = {
            type: 'required',
            message: 'Mottatt fra journalpost er påkrevd',
        };
    }

    if (data.vedtakDetPåklages === '') {
        errors.vedtakDetPåklages = {
            type: 'required',
            message: 'Du må velge et alternativ',
        };
    }

    if (data.erKlagerPartISaken === null) {
        errors.erKlagerPartISaken = {
            type: 'required',
            message: 'Du må velge et alternativ',
        };
    }

    if (data.klagesDetPåKonkreteElementer === null) {
        errors.klagesDetPåKonkreteElementer = {
            type: 'required',
            message: 'Du må velge et alternativ',
        };
    }

    if (data.erKlagefristOverholdt === null) {
        errors.erKlagefristOverholdt = {
            type: 'required',
            message: 'Du må velge et alternativ',
        };
    }

    if (data.erKlagenSignert === null) {
        errors.erKlagenSignert = {
            type: 'required',
            message: 'Du må velge et alternativ',
        };
    }

    return { values: data, errors: errors };
};

export const formkravFormDataTilOpprettKlageRequest = (
    formData: FormkravFormData,
): OpprettKlageRequest => {
    return {
        journalpostId: formData.journalpostId,
        mottattFraJournalpost: dateTilISOTekst(formData.mottattFraJournalpost),
        vedtakDetKlagesPå:
            formData.vedtakDetPåklages === INGEN_VEDTAK ? null : formData.vedtakDetPåklages,
        erKlagerPartISaken: formData.erKlagerPartISaken!,
        klagesDetPåKonkreteElementerIVedtaket: formData.klagesDetPåKonkreteElementer!,
        erKlagefristenOverholdt: formData.erKlagefristOverholdt!,
        erKlagenSignert: formData.erKlagenSignert!,
    };
};

export const klageTilFormkravFormData = (klage: Klagebehandling): FormkravFormData => {
    return {
        journalpostId: klage.journalpostId,
        mottattFraJournalpost: klage.mottattFraJournalpost,
        vedtakDetPåklages: klage.vedtakDetKlagesPå ?? INGEN_VEDTAK,
        erKlagerPartISaken: klage.erKlagerPartISaken,
        klagesDetPåKonkreteElementer: klage.klagesDetPåKonkreteElementerIVedtaket,
        erKlagefristOverholdt: klage.erKlagefristenOverholdt,
        erKlagenSignert: klage.erKlagenSignert,
    };
};
