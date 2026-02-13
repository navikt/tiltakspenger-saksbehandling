import { FieldErrors } from 'react-hook-form';
import {
    Klagebehandling,
    KlagebehandlingResultat,
    Klagehjemmel,
    OmgjøringÅrsak,
    VurderKlageRequest,
} from '~/types/Klage';

export enum OmgjøringÅrsakFormData {
    FEIL_ELLER_ENDRET_FAKTA = 'FEIL_ELLER_ENDRET_FAKTA',
    FEIL_LOVANVENDELSE = 'FEIL_LOVANVENDELSE',
    FEIL_REGELVERKSFORSTÅELSE = 'FEIL_REGELVERKSFORSTÅELSE',
    PROSESSUELL_FEIL = 'PROSESSUELL_FEIL',
    ANNET = 'ANNET',
}

export interface OmgjøringFormData {
    årsak: OmgjøringÅrsakFormData | '';
    begrunnelse: string;
}

export enum KlageVurderingTypeFormData {
    OMGJØR = 'OMGJØR',
    OPPRETTHOLD = 'OPPRETTHOLD',
}

export interface OpprettholdFormData {
    hjemler: string[];
}

export interface VurderingFormData {
    klageVurderingType: KlageVurderingTypeFormData | '';
    omgjør: OmgjøringFormData;
    oppretthold: OpprettholdFormData;
}

export const klagebehandlingTilVurderingFormData = (k: Klagebehandling): VurderingFormData => {
    return {
        klageVurderingType:
            k.resultat === KlagebehandlingResultat.OMGJØR
                ? KlageVurderingTypeFormData.OMGJØR
                : k.resultat === KlagebehandlingResultat.OPPRETTHOLDT
                  ? KlageVurderingTypeFormData.OPPRETTHOLD
                  : '',
        omgjør: {
            årsak: k.årsak ? omgjøringsårsakTilFormData(k.årsak) : '',
            begrunnelse: k.begrunnelse ?? '',
        },
        oppretthold: {
            hjemler:
                k.hjemler?.map(
                    //combobox bruker skiller ikke mellom tekst og verdi, så vi map'er hjemmel til tekst her. ideelt sett skulle combobox støtte value + label
                    (h) => klageHjemlerFormDataTilTekst[klagehjemmelTilKlagehjemmelFormData(h)],
                ) ?? [],
        },
    };
};

export const vurderingFormDataTilVurderKlageRequest = (
    data: VurderingFormData,
): VurderKlageRequest => {
    return {
        vurderingstype:
            data.klageVurderingType === KlageVurderingTypeFormData.OMGJØR
                ? 'OMGJØR'
                : 'OPPRETTHOLD',
        årsak:
            data.klageVurderingType === KlageVurderingTypeFormData.OMGJØR
                ? omgjøringsårsakFormDataTilOmgjøringÅrsak(
                      data.omgjør.årsak as OmgjøringÅrsakFormData,
                  )
                : null,
        begrunnelse:
            data.klageVurderingType === KlageVurderingTypeFormData.OMGJØR
                ? data.omgjør.begrunnelse
                : null,
        hjemler:
            data.klageVurderingType === KlageVurderingTypeFormData.OPPRETTHOLD
                ? data.oppretthold.hjemler.map((h) =>
                      klagehjemmelFormDataTilKlagehjemmel(klagehjemmelTekstTilFormData[h]),
                  )
                : null,
    };
};

const omgjøringsårsakFormDataTilOmgjøringÅrsak = (
    årsak: OmgjøringÅrsakFormData,
): OmgjøringÅrsak => {
    switch (årsak) {
        case OmgjøringÅrsakFormData.FEIL_ELLER_ENDRET_FAKTA:
            return OmgjøringÅrsak.FEIL_ELLER_ENDRET_FAKTA;
        case OmgjøringÅrsakFormData.FEIL_LOVANVENDELSE:
            return OmgjøringÅrsak.FEIL_LOVANVENDELSE;
        case OmgjøringÅrsakFormData.FEIL_REGELVERKSFORSTÅELSE:
            return OmgjøringÅrsak.FEIL_REGELVERKSFORSTAAELSE;
        case OmgjøringÅrsakFormData.PROSESSUELL_FEIL:
            return OmgjøringÅrsak.PROSESSUELL_FEIL;
        case OmgjøringÅrsakFormData.ANNET:
            return OmgjøringÅrsak.ANNET;
    }
};

export const omgjøringsårsakTilFormData = (årsak: OmgjøringÅrsak): OmgjøringÅrsakFormData => {
    switch (årsak) {
        case OmgjøringÅrsak.FEIL_ELLER_ENDRET_FAKTA:
            return OmgjøringÅrsakFormData.FEIL_ELLER_ENDRET_FAKTA;
        case OmgjøringÅrsak.FEIL_LOVANVENDELSE:
            return OmgjøringÅrsakFormData.FEIL_LOVANVENDELSE;
        case OmgjøringÅrsak.FEIL_REGELVERKSFORSTAAELSE:
            return OmgjøringÅrsakFormData.FEIL_REGELVERKSFORSTÅELSE;
        case OmgjøringÅrsak.PROSESSUELL_FEIL:
            return OmgjøringÅrsakFormData.PROSESSUELL_FEIL;
        case OmgjøringÅrsak.ANNET:
            return OmgjøringÅrsakFormData.ANNET;
    }
};

export const vurderingFormValidation = (data: VurderingFormData) => {
    const errors: FieldErrors<VurderingFormData> = {};

    if (data.klageVurderingType === '') {
        errors.klageVurderingType = {
            type: 'required',
            message: 'Du må velge et alternativ',
        };
    }

    if (data.klageVurderingType === KlageVurderingTypeFormData.OMGJØR) {
        const omgjøringErrors = validerOmgjøringForm(data.omgjør);
        if (Object.keys(omgjøringErrors.errors).length > 0) {
            errors.omgjør = {
                årsak: omgjøringErrors.errors.årsak,
                begrunnelse: omgjøringErrors.errors.begrunnelse,
            };
        }
    }

    if (data.klageVurderingType === KlageVurderingTypeFormData.OPPRETTHOLD) {
        if (data.oppretthold.hjemler.length === 0) {
            errors.oppretthold = {
                hjemler: { type: 'required', message: 'Du må velge minst én hjemmel' },
            };
        }
    }

    return { values: data, errors: errors };
};

const validerOmgjøringForm = (data: OmgjøringFormData) => {
    const errors: FieldErrors<OmgjøringFormData> = {};

    if (data.årsak === '') {
        errors.årsak = {
            type: 'required',
            message: 'Du må velge en årsak',
        };
    }

    if (!data.begrunnelse || data.begrunnelse.trim() === '') {
        errors.begrunnelse = {
            type: 'required',
            message: 'Begrunnelse kan ikke være tom',
        };
    }

    return { data: data, errors: errors };
};

export const klageVurderingTypeFormDataTilTekst: Record<KlageVurderingTypeFormData, string> = {
    [KlageVurderingTypeFormData.OMGJØR]: 'Omgjør vedtak',
    [KlageVurderingTypeFormData.OPPRETTHOLD]: 'Oppretthold vedtak',
};

export const omgjøringÅrsakFormDataTilTekst: Record<OmgjøringÅrsakFormData, string> = {
    [OmgjøringÅrsakFormData.FEIL_ELLER_ENDRET_FAKTA]: 'Feil eller endret fakta',
    [OmgjøringÅrsakFormData.FEIL_LOVANVENDELSE]: 'Feil lovanvendelse',
    [OmgjøringÅrsakFormData.FEIL_REGELVERKSFORSTÅELSE]: 'Feil regelverksforståelse',
    [OmgjøringÅrsakFormData.PROSESSUELL_FEIL]: 'Prosessuell feil',
    [OmgjøringÅrsakFormData.ANNET]: 'Annet',
};

export const harKlagevurderingsstegUtfylt = (k: Klagebehandling): boolean => {
    return (
        (k.årsak !== null && k.begrunnelse !== null && k.begrunnelse.trim() !== '') ||
        k.hjemler !== null
    );
};

/**
 * De hjemlene som saksbehandler skal kunne velge mellom
 */
export enum KlagehjemmelFormData {
    ARBEIDSMARKEDSLOVEN_2 = 'ARBEIDSMARKEDSLOVEN_2',
    ARBEIDSMARKEDSLOVEN_13 = 'ARBEIDSMARKEDSLOVEN_13',
    ARBEIDSMARKEDSLOVEN_13_L1 = 'ARBEIDSMARKEDSLOVEN_13_L1',
    ARBEIDSMARKEDSLOVEN_13_L4 = 'ARBEIDSMARKEDSLOVEN_13_L4',
    ARBEIDSMARKEDSLOVEN_15 = 'ARBEIDSMARKEDSLOVEN_15',
    ARBEIDSMARKEDSLOVEN_17 = 'ARBEIDSMARKEDSLOVEN_17',
    ARBEIDSMARKEDSLOVEN_22 = 'ARBEIDSMARKEDSLOVEN_22',

    FOLKETRYGDLOVEN_22_15 = 'FOLKETRYGDLOVEN_22_15',
    FOLKETRYGDLOVEN_22_17_A = 'FOLKETRYGDLOVEN_22_17_A',

    FORELDELSESLOVEN_10 = 'FORELDELSESLOVEN_10',
    FORELDELSESLOVEN_2_OG_3 = 'FORELDELSESLOVEN_2_OG_3',

    FORVALTNINGSLOVEN_11 = 'FORVALTNINGSLOVEN_11',
    FORVALTNINGSLOVEN_17 = 'FORVALTNINGSLOVEN_17',
    FORVALTNINGSLOVEN_18_OG_19 = 'FORVALTNINGSLOVEN_18_OG_19',
    FORVALTNINGSLOVEN_28 = 'FORVALTNINGSLOVEN_28',
    FORVALTNINGSLOVEN_30 = 'FORVALTNINGSLOVEN_30',
    FORVALTNINGSLOVEN_31 = 'FORVALTNINGSLOVEN_31',
    FORVALTNINGSLOVEN_32 = 'FORVALTNINGSLOVEN_32',
    FORVALTNINGSLOVEN_35 = 'FORVALTNINGSLOVEN_35',
    FORVALTNINGSLOVEN_41 = 'FORVALTNINGSLOVEN_41',
    FORVALTNINGSLOVEN_42 = 'FORVALTNINGSLOVEN_42',

    TILTAKSPENGEFORSKRIFTEN_2 = 'TILTAKSPENGEFORSKRIFTEN_2',
    TILTAKSPENGEFORSKRIFTEN_3 = 'TILTAKSPENGEFORSKRIFTEN_3',
    TILTAKSPENGEFORSKRIFTEN_5 = 'TILTAKSPENGEFORSKRIFTEN_5',
    TILTAKSPENGEFORSKRIFTEN_6 = 'TILTAKSPENGEFORSKRIFTEN_6',
    TILTAKSPENGEFORSKRIFTEN_7 = 'TILTAKSPENGEFORSKRIFTEN_7',
    TILTAKSPENGEFORSKRIFTEN_8 = 'TILTAKSPENGEFORSKRIFTEN_8',
    TILTAKSPENGEFORSKRIFTEN_9 = 'TILTAKSPENGEFORSKRIFTEN_9',
    TILTAKSPENGEFORSKRIFTEN_10 = 'TILTAKSPENGEFORSKRIFTEN_10',
    TILTAKSPENGEFORSKRIFTEN_11 = 'TILTAKSPENGEFORSKRIFTEN_11',
}

export const klageHjemlerFormDataTilTekst: Record<KlagehjemmelFormData, string> = {
    [KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_2]: 'Arb.mark.lov §2',
    [KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_13]: 'Arb.mark.lov §13',
    [KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_13_L1]: 'Arb.mark.lov §13 - lønn',
    [KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_13_L4]: 'Arb.mark.lov §13 fjerde ledd',
    [KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_15]: 'Arb.mark.lov §15',
    [KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_17]: 'Arb.mark.lov §17',
    [KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_22]: 'Arb.mark.lov §22',

    [KlagehjemmelFormData.FOLKETRYGDLOVEN_22_15]: 'Folketrygdloven §22-15',
    [KlagehjemmelFormData.FOLKETRYGDLOVEN_22_17_A]: 'Folketrygdloven §22-17 a',

    [KlagehjemmelFormData.FORELDELSESLOVEN_10]: 'Foreldelsesloven §10',
    [KlagehjemmelFormData.FORELDELSESLOVEN_2_OG_3]: 'Foreldelsesloven §§2 og 3',

    [KlagehjemmelFormData.FORVALTNINGSLOVEN_11]: 'Forvaltningsloven §11',
    [KlagehjemmelFormData.FORVALTNINGSLOVEN_17]: 'Forvaltningsloven §17',
    [KlagehjemmelFormData.FORVALTNINGSLOVEN_18_OG_19]: 'Forvaltningsloven §§18 og 19',
    [KlagehjemmelFormData.FORVALTNINGSLOVEN_28]: 'Forvaltningsloven §28',
    [KlagehjemmelFormData.FORVALTNINGSLOVEN_30]: 'Forvaltningsloven §30',
    [KlagehjemmelFormData.FORVALTNINGSLOVEN_31]: 'Forvaltningsloven §31',
    [KlagehjemmelFormData.FORVALTNINGSLOVEN_32]: 'Forvaltningsloven §32',
    [KlagehjemmelFormData.FORVALTNINGSLOVEN_35]: 'Forvaltningsloven §35',
    [KlagehjemmelFormData.FORVALTNINGSLOVEN_41]: 'Forvaltningsloven §41',
    [KlagehjemmelFormData.FORVALTNINGSLOVEN_42]: 'Forvaltningsloven §42',

    [KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_2]: 'Tiltakspengeforskriften §2',
    [KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_3]: 'Tiltakspengeforskriften §3',
    [KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_5]: 'Tiltakspengeforskriften §5',
    [KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_6]: 'Tiltakspengeforskriften §6',
    [KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_7]: 'Tiltakspengeforskriften §7',
    [KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_8]: 'Tiltakspengeforskriften §8',
    [KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_9]: 'Tiltakspengeforskriften §9',
    [KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_10]: 'Tiltakspengeforskriften §10',
    [KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_11]: 'Tiltakspengeforskriften §11',
};

//comboboxen skiller ikke mellom tekst og verdi, så vi trenger en mapping fra tekst-verdi til enum typen.
const klagehjemmelTekstTilFormData: Record<string, KlagehjemmelFormData> = Object.entries(
    klageHjemlerFormDataTilTekst,
).reduce(
    (acc, [key, value]) => {
        acc[value] = key as KlagehjemmelFormData;
        return acc;
    },
    {} as Record<string, KlagehjemmelFormData>,
);

export const klagehjemmelTilKlagehjemmelFormData = (
    hjemmel: Klagehjemmel,
): KlagehjemmelFormData => {
    switch (hjemmel) {
        case Klagehjemmel.ARBEIDSMARKEDSLOVEN_2:
            return KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_2;
        case Klagehjemmel.ARBEIDSMARKEDSLOVEN_13:
            return KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_13;
        case Klagehjemmel.ARBEIDSMARKEDSLOVEN_13_L1:
            return KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_13_L1;
        case Klagehjemmel.ARBEIDSMARKEDSLOVEN_13_L4:
            return KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_13_L4;
        case Klagehjemmel.ARBEIDSMARKEDSLOVEN_15:
            return KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_15;
        case Klagehjemmel.ARBEIDSMARKEDSLOVEN_17:
            return KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_17;
        case Klagehjemmel.ARBEIDSMARKEDSLOVEN_22:
            return KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_22;
        case Klagehjemmel.FOLKETRYGDLOVEN_22_15:
            return KlagehjemmelFormData.FOLKETRYGDLOVEN_22_15;
        case Klagehjemmel.FOLKETRYGDLOVEN_22_17_A:
            return KlagehjemmelFormData.FOLKETRYGDLOVEN_22_17_A;
        case Klagehjemmel.FORELDELSESLOVEN_10:
            return KlagehjemmelFormData.FORELDELSESLOVEN_10;
        case Klagehjemmel.FORELDELSESLOVEN_2_OG_3:
            return KlagehjemmelFormData.FORELDELSESLOVEN_2_OG_3;
        case Klagehjemmel.FORVALTNINGSLOVEN_11:
            return KlagehjemmelFormData.FORVALTNINGSLOVEN_11;
        case Klagehjemmel.FORVALTNINGSLOVEN_17:
            return KlagehjemmelFormData.FORVALTNINGSLOVEN_17;
        case Klagehjemmel.FORVALTNINGSLOVEN_18_OG_19:
            return KlagehjemmelFormData.FORVALTNINGSLOVEN_18_OG_19;
        case Klagehjemmel.FORVALTNINGSLOVEN_28:
            return KlagehjemmelFormData.FORVALTNINGSLOVEN_28;
        case Klagehjemmel.FORVALTNINGSLOVEN_30:
            return KlagehjemmelFormData.FORVALTNINGSLOVEN_30;
        case Klagehjemmel.FORVALTNINGSLOVEN_31:
            return KlagehjemmelFormData.FORVALTNINGSLOVEN_31;
        case Klagehjemmel.FORVALTNINGSLOVEN_32:
            return KlagehjemmelFormData.FORVALTNINGSLOVEN_32;
        case Klagehjemmel.FORVALTNINGSLOVEN_35:
            return KlagehjemmelFormData.FORVALTNINGSLOVEN_35;
        case Klagehjemmel.FORVALTNINGSLOVEN_41:
            return KlagehjemmelFormData.FORVALTNINGSLOVEN_41;
        case Klagehjemmel.FORVALTNINGSLOVEN_42:
            return KlagehjemmelFormData.FORVALTNINGSLOVEN_42;
        case Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_2:
            return KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_2;
        case Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_3:
            return KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_3;
        case Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_5:
            return KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_5;
        case Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_6:
            return KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_6;
        case Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_7:
            return KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_7;
        case Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_8:
            return KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_8;
        case Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_9:
            return KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_9;
        case Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_10:
            return KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_10;
        case Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_11:
            return KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_11;
    }
};

export const klagehjemmelFormDataTilKlagehjemmel = (
    hjemmel: KlagehjemmelFormData,
): Klagehjemmel => {
    switch (hjemmel) {
        case KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_2:
            return Klagehjemmel.ARBEIDSMARKEDSLOVEN_2;
        case KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_13:
            return Klagehjemmel.ARBEIDSMARKEDSLOVEN_13;
        case KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_13_L1:
            return Klagehjemmel.ARBEIDSMARKEDSLOVEN_13_L1;
        case KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_13_L4:
            return Klagehjemmel.ARBEIDSMARKEDSLOVEN_13_L4;
        case KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_15:
            return Klagehjemmel.ARBEIDSMARKEDSLOVEN_15;
        case KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_17:
            return Klagehjemmel.ARBEIDSMARKEDSLOVEN_17;
        case KlagehjemmelFormData.ARBEIDSMARKEDSLOVEN_22:
            return Klagehjemmel.ARBEIDSMARKEDSLOVEN_22;
        case KlagehjemmelFormData.FOLKETRYGDLOVEN_22_15:
            return Klagehjemmel.FOLKETRYGDLOVEN_22_15;
        case KlagehjemmelFormData.FOLKETRYGDLOVEN_22_17_A:
            return Klagehjemmel.FOLKETRYGDLOVEN_22_17_A;
        case KlagehjemmelFormData.FORELDELSESLOVEN_10:
            return Klagehjemmel.FORELDELSESLOVEN_10;
        case KlagehjemmelFormData.FORELDELSESLOVEN_2_OG_3:
            return Klagehjemmel.FORELDELSESLOVEN_2_OG_3;
        case KlagehjemmelFormData.FORVALTNINGSLOVEN_11:
            return Klagehjemmel.FORVALTNINGSLOVEN_11;
        case KlagehjemmelFormData.FORVALTNINGSLOVEN_17:
            return Klagehjemmel.FORVALTNINGSLOVEN_17;
        case KlagehjemmelFormData.FORVALTNINGSLOVEN_18_OG_19:
            return Klagehjemmel.FORVALTNINGSLOVEN_18_OG_19;
        case KlagehjemmelFormData.FORVALTNINGSLOVEN_28:
            return Klagehjemmel.FORVALTNINGSLOVEN_28;
        case KlagehjemmelFormData.FORVALTNINGSLOVEN_30:
            return Klagehjemmel.FORVALTNINGSLOVEN_30;
        case KlagehjemmelFormData.FORVALTNINGSLOVEN_31:
            return Klagehjemmel.FORVALTNINGSLOVEN_31;
        case KlagehjemmelFormData.FORVALTNINGSLOVEN_32:
            return Klagehjemmel.FORVALTNINGSLOVEN_32;
        case KlagehjemmelFormData.FORVALTNINGSLOVEN_35:
            return Klagehjemmel.FORVALTNINGSLOVEN_35;
        case KlagehjemmelFormData.FORVALTNINGSLOVEN_41:
            return Klagehjemmel.FORVALTNINGSLOVEN_41;
        case KlagehjemmelFormData.FORVALTNINGSLOVEN_42:
            return Klagehjemmel.FORVALTNINGSLOVEN_42;
        case KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_2:
            return Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_2;
        case KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_3:
            return Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_3;
        case KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_5:
            return Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_5;
        case KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_6:
            return Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_6;
        case KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_7:
            return Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_7;
        case KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_8:
            return Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_8;
        case KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_9:
            return Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_9;
        case KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_10:
            return Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_10;
        case KlagehjemmelFormData.TILTAKSPENGEFORSKRIFTEN_11:
            return Klagehjemmel.TILTAKSPENGEFORSKRIFTEN_11;
    }
};
