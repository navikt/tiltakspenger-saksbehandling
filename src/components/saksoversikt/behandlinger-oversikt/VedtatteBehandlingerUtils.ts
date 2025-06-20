import { BehandlingData, BehandlingResultat, Behandlingstype } from '~/types/BehandlingTypes';
import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';

export interface VedtattBehandlingDataCellInfo {
    id: string;
    sakId: string;
    søknadId: string;
    behandlingstype: Behandlingstype;
    resultat: Nullable<BehandlingResultat>;
    tidspunktAvsluttet: string;
    behandlingsperiode: Nullable<Periode>;
    avsluttetPga: 'ferdigBehandlet' | 'avbrutt';
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
}

export const vedtattBehandlingToDataCellInfo = (
    behandling: BehandlingData,
): VedtattBehandlingDataCellInfo => {
    const tidspunktAvsluttet = behandling.avbrutt?.avbruttTidspunkt
        ? behandling.avbrutt.avbruttTidspunkt
        : behandling.iverksattTidspunkt!;

    let søknadId = '';
    if ('søknad' in behandling && behandling.søknad) {
        søknadId = behandling.søknad.id;
    }

    return {
        id: behandling.id,
        sakId: behandling.sakId,
        søknadId: søknadId,
        behandlingsperiode: behandling.virkningsperiode,
        resultat: behandling.resultat,
        behandlingstype: behandling.type,
        tidspunktAvsluttet: tidspunktAvsluttet,
        avsluttetPga: behandling.avbrutt ? 'avbrutt' : 'ferdigBehandlet',
        saksbehandler: behandling.saksbehandler,
        beslutter: behandling.beslutter,
    };
};
