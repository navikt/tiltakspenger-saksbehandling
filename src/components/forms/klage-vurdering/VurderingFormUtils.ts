import { FieldErrors } from 'react-hook-form';
import { OmgjøringÅrsak, VurderKlageRequest } from '~/types/Klage';

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
}

export interface VurderingFormData {
    klageVurderingType: KlageVurderingTypeFormData;
    omgjør: OmgjøringFormData;
}

export const klagebehandlingTilVurderingFormData = (): VurderingFormData => {
    return {
        klageVurderingType: KlageVurderingTypeFormData.OMGJØR,
        omgjør: {
            årsak: '',
            begrunnelse: '',
        },
    };
};

export const vurderingFormDataTilVurderKlageRequest = (
    data: VurderingFormData,
): VurderKlageRequest => {
    return {
        årsak: omgjøringsårsakFormDataTilOmgjøringÅrsak(
            data.omgjør.årsak as OmgjøringÅrsakFormData,
        ),
        begrunnelse: data.omgjør.begrunnelse,
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

export const vurderingFormValidation = (data: VurderingFormData) => {
    const errors: FieldErrors<VurderingFormData> = {};

    //Per dags dato har vi kun støtte for omgjøring - ved omgjøring skal saksbehandler velge alternativ
    // if (data.klageVurderingType === '') {
    //     errors.klageVurderingType = {
    //         type: 'required',
    //         message: 'Du må velge et alternativ',
    //     };
    // }

    if (data.klageVurderingType === KlageVurderingTypeFormData.OMGJØR) {
        const omgjøringErrors = validerOmgjøringForm(data.omgjør);
        if (Object.keys(omgjøringErrors.errors).length > 0) {
            errors.omgjør = {
                årsak: omgjøringErrors.errors.årsak,
                begrunnelse: omgjøringErrors.errors.begrunnelse,
            };
        }
    }

    return {
        values: data,
        errors: errors,
    };
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

    return {
        data: data,
        errors: errors,
    };
};

export const klageVurderingTypeFormDataTilTekst: Record<KlageVurderingTypeFormData, string> = {
    [KlageVurderingTypeFormData.OMGJØR]: 'Omgjør vedtak',
};

export const omgjøringÅrsakFormDataTilTekst: Record<OmgjøringÅrsakFormData, string> = {
    [OmgjøringÅrsakFormData.FEIL_ELLER_ENDRET_FAKTA]: 'Feil eller endret fakta',
    [OmgjøringÅrsakFormData.FEIL_LOVANVENDELSE]: 'Feil lovanvendelse',
    [OmgjøringÅrsakFormData.FEIL_REGELVERKSFORSTÅELSE]: 'Feil regelverksforståelse',
    [OmgjøringÅrsakFormData.PROSESSUELL_FEIL]: 'Prosessuell feil',
    [OmgjøringÅrsakFormData.ANNET]: 'Annet',
};
