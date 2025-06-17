import { BehandlingResultat, Behandlingstype } from '~/types/BehandlingTypes';
import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import { SøknadForBehandlingProps } from '~/types/SøknadTypes';

export interface AvbruttSøknadDataCellInfo {
    id: string;
    behandlingstype: Behandlingstype;
    resultat: Nullable<BehandlingResultat>;
    tidspunktAvsluttet: string;
    behandlingsperiode: Nullable<Periode>;
    avsluttetPga: 'ferdigBehandlet' | 'avbrutt';
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
}

export const avbruttSøknadToDataCellInfo = (
    søknad: SøknadForBehandlingProps,
): AvbruttSøknadDataCellInfo => {
    if (søknad.avbrutt == null) {
        throw new Error('Kan ikke hente ut informasjon fra en behandling som ikke er avbrutt');
    }
    return {
        id: søknad.id,
        behandlingsperiode: {
            fraOgMed: Array.isArray(søknad.tiltak)
                ? søknad.tiltak[0].fraOgMed
                : søknad.tiltak.fraOgMed,
            tilOgMed: Array.isArray(søknad.tiltak)
                ? søknad.tiltak[søknad.tiltak.length - 1].tilOgMed
                : søknad.tiltak.tilOgMed,
        },
        resultat: null,
        behandlingstype: Behandlingstype.SØKNAD,
        tidspunktAvsluttet: søknad.avbrutt.avbruttTidspunkt,
        avsluttetPga: 'avbrutt',
    };
};
