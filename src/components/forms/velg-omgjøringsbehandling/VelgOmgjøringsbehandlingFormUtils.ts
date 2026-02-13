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
        data.behandlingstype === VelgOmgjøringsbehandlingTyper.SØKNADSBEHANDLING &&
        data.søknadId === ''
    ) {
        errors.søknadId = {
            type: 'required',
            message: 'Du må velge en søknad',
        };
    }
    return { values: data, errors: errors };
};

export enum VelgOmgjøringsbehandlingTyper {
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING_INNVILGELSE',
    REVURDERING_INNVILGELSE = 'REVURDERING_INNVILGELSE',
    REVURDERING_OMGJØRING = 'REVURDERING_OMGJØRING',
}

export const velgOmgjøringsbehandlingFormDataTilOpprettRammebehandlingRequest = (
    formdata: VelgOmgjøringsbehandlingFormData,
): OpprettOmgjøringsbehandlingForKlageRequest => {
    return {
        type: formdata.behandlingstype as VelgOmgjøringsbehandlingTyper,
        søknadId:
            formdata.behandlingstype === VelgOmgjøringsbehandlingTyper.SØKNADSBEHANDLING
                ? formdata.søknadId
                : null,
    };
};
