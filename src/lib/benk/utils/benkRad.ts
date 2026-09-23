import { Nullable } from '~/types/UtilTypes';
import {
    BenkBehandling,
    BenkBehandlingMedTilgang,
    BenkBehandlingsstatus,
    BenkTilgangsvurdering,
    BenkVentestatus,
} from '../typer/felles';

/**
 * Speiler `kanFortsetteBehandling` for rammebehandlinger med feltene en benk-rad har:
 * saksbehandler eier behandlingen, og den er ikke satt på vent.
 */
export const kanFortsetteBenkRad = (
    rad: {
        status: BenkBehandlingsstatus;
        saksbehandler: Nullable<string>;
        beslutter: Nullable<string>;
        ventestatus: BenkVentestatus;
    },
    navIdent: string,
): boolean => {
    if (rad.ventestatus.erSattPåVent) {
        return false;
    }

    switch (rad.status) {
        case BenkBehandlingsstatus.UNDER_AUTOMATISK_BEHANDLING:
        case BenkBehandlingsstatus.UNDER_BEHANDLING:
            return rad.saksbehandler === navIdent;
        case BenkBehandlingsstatus.UNDER_BESLUTNING:
            return rad.beslutter === navIdent;
        default:
            return false;
    }
};

export const benkBehandlingHarTilgang = (
    behandling: BenkBehandling,
): behandling is BenkBehandlingMedTilgang => {
    return behandling.tilgang.vurdering === BenkTilgangsvurdering.HAR_TILGANG;
};
