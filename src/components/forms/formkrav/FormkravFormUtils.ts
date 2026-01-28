import { FieldErrors } from 'react-hook-form';
import {
    KlagefristUnntakSvarord,
    Klagebehandling,
    OppdaterKlageFormkravRequest,
    OpprettKlageRequest,
} from '~/types/Klage';
import { VedtakId } from '~/types/Rammevedtak';
import { Nullable } from '~/types/UtilTypes';

export const INGEN_VEDTAK = 'INGEN_VEDTAK' as const;

export interface FormkravFormData {
    journalpostId: string;
    vedtakDetPåklages: typeof INGEN_VEDTAK | VedtakId | '';
    erKlagerPartISaken: Nullable<boolean>;
    klagesDetPåKonkreteElementer: Nullable<boolean>;
    erKlagefristOverholdt: Nullable<boolean>;
    erUnntakForKlagefrist: Nullable<KlagefristUnntakSvarordFormData>;
    erKlagenSignert: Nullable<boolean>;
}

export enum KlagefristUnntakSvarordFormData {
    JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN = 'JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN',
    JA_AV_SÆRLIGE_GRUNNER = 'JA_AV_SÆRLIGE_GRUNNER',
    NEI = 'NEI',
}

export const KlagefristUnntakSvarordFormDataTekstMapper: Record<
    KlagefristUnntakSvarordFormData,
    string
> = {
    [KlagefristUnntakSvarordFormData.JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN]:
        'Ja, klager kan ikke lastes for å ha sendt inn etter fristen',
    [KlagefristUnntakSvarordFormData.JA_AV_SÆRLIGE_GRUNNER]:
        'Ja, av særlige grunner er de rimelig at klagen blir behandlet',
    [KlagefristUnntakSvarordFormData.NEI]: 'Nei',
};

export const formkravValidation = (data: FormkravFormData) => {
    const errors: FieldErrors<FormkravFormData> = {};

    if (!data.journalpostId) {
        errors.journalpostId = {
            type: 'required',
            message: 'Journalpost ID er påkrevd',
        };
    }

    if (data.journalpostId && !/^[0-9]+$/.test(data.journalpostId)) {
        errors.journalpostId = {
            type: 'pattern',
            message: 'Journalpost ID kan kun inneholde tall',
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

    if (data.erKlagefristOverholdt === false) {
        if (!data.erUnntakForKlagefrist) {
            errors.erUnntakForKlagefrist = {
                type: 'required',
                message: 'Du må velge et alternativ',
            };
        }
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
        vedtakDetKlagesPå:
            formData.vedtakDetPåklages === INGEN_VEDTAK ? null : formData.vedtakDetPåklages,
        erKlagerPartISaken: formData.erKlagerPartISaken!,
        klagesDetPåKonkreteElementerIVedtaket: formData.klagesDetPåKonkreteElementer!,
        erKlagefristenOverholdt: formData.erKlagefristOverholdt!,
        erUnntakForKlagefrist:
            formData.erKlagefristOverholdt === false
                ? klagefristUnntakSvarordFormDataTilKlagebehandlingKlagefristUnntakSvarord(
                      formData.erUnntakForKlagefrist!,
                  )
                : null,
        erKlagenSignert: formData.erKlagenSignert!,
    };
};

export const formkravFormDataTilOppdaterKlageFormkravRequest = (
    formData: FormkravFormData,
): OppdaterKlageFormkravRequest => {
    return {
        journalpostId: formData.journalpostId,
        vedtakDetKlagesPå:
            formData.vedtakDetPåklages === INGEN_VEDTAK ? null : formData.vedtakDetPåklages,
        erKlagerPartISaken: formData.erKlagerPartISaken!,
        klagesDetPåKonkreteElementerIVedtaket: formData.klagesDetPåKonkreteElementer!,
        erKlagefristenOverholdt: formData.erKlagefristOverholdt!,
        erUnntakForKlagefrist:
            formData.erKlagefristOverholdt === false
                ? klagefristUnntakSvarordFormDataTilKlagebehandlingKlagefristUnntakSvarord(
                      formData.erUnntakForKlagefrist!,
                  )
                : null,
        erKlagenSignert: formData.erKlagenSignert!,
    };
};

export const klagefristUnntakSvarordFormDataTilKlagebehandlingKlagefristUnntakSvarord = (
    svarord: KlagefristUnntakSvarordFormData,
): KlagefristUnntakSvarord => {
    switch (svarord) {
        case KlagefristUnntakSvarordFormData.JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN:
            return KlagefristUnntakSvarord.JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN;
        case KlagefristUnntakSvarordFormData.JA_AV_SÆRLIGE_GRUNNER:
            return KlagefristUnntakSvarord.JA_AV_SÆRLIGE_GRUNNER;
        case KlagefristUnntakSvarordFormData.NEI:
            return KlagefristUnntakSvarord.NEI;
    }
};

export const klageTilFormkravFormData = (klage: Klagebehandling): FormkravFormData => {
    return {
        journalpostId: klage.journalpostId,
        vedtakDetPåklages: klage.vedtakDetKlagesPå ?? INGEN_VEDTAK,
        erKlagerPartISaken: klage.erKlagerPartISaken,
        klagesDetPåKonkreteElementer: klage.klagesDetPåKonkreteElementerIVedtaket,
        erKlagefristOverholdt: klage.erKlagefristenOverholdt,
        erUnntakForKlagefrist: klage.erUnntakForKlagefrist
            ? klagebehandlingKlagefristUnntakSvarordTilKlagefristUnntakSvarordFormData(
                  klage.erUnntakForKlagefrist,
              )
            : null,
        erKlagenSignert: klage.erKlagenSignert,
    };
};

export const klagebehandlingKlagefristUnntakSvarordTilKlagefristUnntakSvarordFormData = (
    svarord: KlagefristUnntakSvarord,
): KlagefristUnntakSvarordFormData => {
    switch (svarord) {
        case KlagefristUnntakSvarord.JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN:
            return KlagefristUnntakSvarordFormData.JA_KLAGER_KAN_IKKE_LASTES_FOR_Å_HA_SENDT_INN_ETTER_FRISTEN;
        case KlagefristUnntakSvarord.JA_AV_SÆRLIGE_GRUNNER:
            return KlagefristUnntakSvarordFormData.JA_AV_SÆRLIGE_GRUNNER;
        case KlagefristUnntakSvarord.NEI:
            return KlagefristUnntakSvarordFormData.NEI;
    }
};
