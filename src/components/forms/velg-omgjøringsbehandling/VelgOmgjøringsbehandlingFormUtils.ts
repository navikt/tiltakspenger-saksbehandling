import { FieldErrors } from 'react-hook-form';
import { OpprettOmgjøringsbehandlingForKlageRequest } from '~/types/Klage';
import { VedtakId } from '~/types/Rammevedtak';
import { SøknadId } from '~/types/Søknad';

export interface VelgOmgjøringsbehandlingFormData {
    behandlingstype: VelgOmgjøringsbehandlingTyper | '';
    søknadId: SøknadId | '';
    vedtakId: VedtakId | '';
}

export const velgOmgjøringsbehandlingFormValidation = (data: VelgOmgjøringsbehandlingFormData) => {
    const errors: FieldErrors<VelgOmgjøringsbehandlingFormData> = {};

    if (data.behandlingstype === '') {
        errors.behandlingstype = {
            type: 'required',
            message: 'Du må velge en behandlingstype',
        };
    }

    if (
        data.behandlingstype === VelgOmgjøringsbehandlingTyper.SØKNADSBEHANDLING_INNVILGELSE &&
        data.søknadId === ''
    ) {
        errors.søknadId = {
            type: 'required',
            message: 'Du må velge en søknad',
        };
    }

    if (
        data.behandlingstype === VelgOmgjøringsbehandlingTyper.REVURDERING_OMGJØRING &&
        data.vedtakId === ''
    ) {
        errors.vedtakId = {
            type: 'required',
            message: 'Du må velge et vedtak',
        };
    }

    return {
        values: data,
        errors: errors,
    };
};

export enum VelgOmgjøringsbehandlingTyper {
    SØKNADSBEHANDLING_INNVILGELSE = 'SØKNADSBEHANDLING_INNVILGELSE',
    REVURDERING_INNVILGELSE = 'REVURDERING_INNVILGELSE',
    REVURDERING_OMGJØRING = 'REVURDERING_OMGJØRING',
}

export const velgOmgjøringsbehandlingFormDataTilOpprettRammebehandlingRequest = (
    formdata: VelgOmgjøringsbehandlingFormData,
): OpprettOmgjøringsbehandlingForKlageRequest => {
    return {
        type: formdata.behandlingstype as VelgOmgjøringsbehandlingTyper,
        søknadId:
            formdata.behandlingstype === VelgOmgjøringsbehandlingTyper.SØKNADSBEHANDLING_INNVILGELSE
                ? formdata.søknadId
                : null,
        vedtakIdSomOmgjøres:
            formdata.behandlingstype === VelgOmgjøringsbehandlingTyper.REVURDERING_INNVILGELSE ||
            formdata.behandlingstype === VelgOmgjøringsbehandlingTyper.REVURDERING_OMGJØRING
                ? formdata.vedtakId
                : null,
    };
};
