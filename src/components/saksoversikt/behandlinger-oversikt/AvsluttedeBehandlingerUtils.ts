import { Behandlingstype, BehandlingData } from '../../../types/BehandlingTypes';
import { Nullable } from '../../../types/common';
import { Periode } from '../../../types/Periode';
import { SøknadForBehandlingProps } from '../../../types/SøknadTypes';

export interface AvsluttetBehandlingDataCellInfo {
    id: string;
    behandlingstype: Behandlingstype;
    tidspunktAvsluttet: string;
    behandlingsperiode: Nullable<Periode>;
    avsluttetPga: 'ferdigBehandlet' | 'avbrutt';
}

export const avsluttetBehandlingToDataCellInfo = (
    behandling: BehandlingData,
): AvsluttetBehandlingDataCellInfo => {
    const tidspunktAvsluttet = behandling.avbrutt?.avbruttTidspunkt
        ? behandling.avbrutt.avbruttTidspunkt
        : behandling.iverksattTidspunkt!;

    return {
        id: behandling.id,
        behandlingsperiode: behandling.virkningsperiode,
        behandlingstype: behandling.type,
        tidspunktAvsluttet: tidspunktAvsluttet,
        avsluttetPga: behandling.avbrutt ? 'avbrutt' : 'ferdigBehandlet',
    };
};

export const avbruttSøknadToDataCellInfo = (
    søknad: SøknadForBehandlingProps,
): AvsluttetBehandlingDataCellInfo => {
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
        behandlingstype: Behandlingstype.SØKNAD,
        tidspunktAvsluttet: søknad.avbrutt.avbruttTidspunkt,
        avsluttetPga: 'avbrutt',
    };
};
