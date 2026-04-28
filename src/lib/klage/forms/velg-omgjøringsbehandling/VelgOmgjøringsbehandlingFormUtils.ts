import { FieldErrors } from 'react-hook-form';
import { OpprettOmgjøringsbehandlingForKlageRequest } from '~/lib/klage/typer/Klage';
import { VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import { SøknadId } from '~/types/Søknad';

export interface VelgOmgjøringsbehandlingFormData {
    behandlingstype: VelgOmgjøringsbehandlingTyper | '';
    søknadId: SøknadId | '';
    vedtakSomSkalOmgjøres: VedtakId | '';
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

    if (
        data.behandlingstype === VelgOmgjøringsbehandlingTyper.REVURDERING_OMGJØRING &&
        data.vedtakSomSkalOmgjøres === ''
    ) {
        errors.vedtakSomSkalOmgjøres = {
            type: 'required',
            message: 'Du må velge et vedtak som skal omgjøres',
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
        vedtakIdSomSkalOmgjøres:
            formdata.behandlingstype === VelgOmgjøringsbehandlingTyper.REVURDERING_OMGJØRING
                ? formdata.vedtakSomSkalOmgjøres
                : null,
    };
};
