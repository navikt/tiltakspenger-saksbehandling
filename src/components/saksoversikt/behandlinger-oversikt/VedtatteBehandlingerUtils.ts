import {
    BehandlingData,
    BehandlingId,
    BehandlingResultat,
    Behandlingstype,
} from '~/types/BehandlingTypes';
import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import { SakId } from '~/types/SakTypes';
import { SøknadId } from '~/types/SøknadTypes';

export interface VedtattBehandlingDataCellInfo {
    id: BehandlingId;
    sakId: SakId;
    saksnummer: string;
    søknadId?: SøknadId;
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

    const søknadId =
        behandling.type === Behandlingstype.SØKNADSBEHANDLING ? behandling.søknad.id : undefined;

    return {
        id: behandling.id,
        sakId: behandling.sakId,
        saksnummer: behandling.saksnummer,
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
