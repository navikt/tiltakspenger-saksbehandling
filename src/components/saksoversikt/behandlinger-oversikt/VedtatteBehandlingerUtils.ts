import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import { SakId } from '~/types/Sak';
import {
    Rammebehandling,
    BehandlingId,
    BehandlingResultat,
    Behandlingstype,
} from '~/types/Behandling';
import { SøknadId } from '~/types/Søknad';
import { VedtakId } from '~/types/Vedtak';

export interface VedtattBehandlingCellInfo {
    id: BehandlingId;
    sakId: SakId;
    saksnummer: string;
    søknadId?: SøknadId;
    behandlingstype: Behandlingstype;
    resultat: BehandlingResultat;
    tidspunktAvsluttet: string;
    behandlingsperiode: Nullable<Periode>;
    avsluttetPga: 'ferdigBehandlet' | 'avbrutt';
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
    rammevedtakId: Nullable<VedtakId>;
}

export const vedtattBehandlingToDataCellInfo = (
    behandling: Rammebehandling,
): VedtattBehandlingCellInfo => {
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
        rammevedtakId: behandling.rammevedtakId,
    };
};
