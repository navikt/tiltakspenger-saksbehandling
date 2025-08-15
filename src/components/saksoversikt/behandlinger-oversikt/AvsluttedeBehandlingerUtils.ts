import {
    BehandlingData,
    BehandlingId,
    BehandlingResultat,
    Behandlingstype,
} from '~/types/BehandlingTypes';
import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import { SøknadForBehandlingProps, SøknadId } from '~/types/SøknadTypes';

type AvbruttSøknad = {
    behandlingstype: Behandlingstype.SØKNAD;
    id: SøknadId;
};

type AvbruttBehandling = {
    behandlingstype: Behandlingstype.SØKNADSBEHANDLING | Behandlingstype.REVURDERING;
    id: BehandlingId;
    resultat: Nullable<BehandlingResultat>;
};

export type AvbruttSøknadEllerBehandlingDataCellInfo = {
    tidspunktAvsluttet: string;
    behandlingsperiode: Nullable<Periode>;
    avsluttetPga: 'ferdigBehandlet' | 'avbrutt';
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
} & (AvbruttSøknad | AvbruttBehandling);

export const avbruttBehandlingToDataCellInfo = (
    behandling: BehandlingData,
): AvbruttSøknadEllerBehandlingDataCellInfo => {
    const tidspunktAvsluttet = behandling.avbrutt?.avbruttTidspunkt
        ? behandling.avbrutt.avbruttTidspunkt
        : behandling.iverksattTidspunkt!;

    return {
        id: behandling.id,
        behandlingsperiode: behandling.virkningsperiode,
        resultat: behandling.resultat,
        behandlingstype: behandling.type,
        tidspunktAvsluttet: tidspunktAvsluttet,
        avsluttetPga: behandling.avbrutt ? 'avbrutt' : 'ferdigBehandlet',
        saksbehandler: behandling.saksbehandler,
        beslutter: behandling.beslutter,
    };
};

export const avbruttSøknadToDataCellInfo = (
    søknad: SøknadForBehandlingProps,
): AvbruttSøknadEllerBehandlingDataCellInfo => {
    if (søknad.avbrutt == null) {
        throw new Error('Kan ikke hente ut informasjon fra en behandling som ikke er begrunnelse');
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
