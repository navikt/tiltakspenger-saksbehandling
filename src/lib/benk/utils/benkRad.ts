import { Nullable } from '~/types/UtilTypes';
import { Prioritering } from '~/lib/_felles/prioritering/prioriteringTyper';
import {
    BenkBehandling,
    BenkBehandlingMedTilgang,
    BenkBehandlingsstatus,
    BenkBehandlingstype,
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

/**
 * Rammebehandlinger og meldekortbehandlinger kan prioriteres. Backend sorterer de prioriterte radene øverst.
 * Innsendte og korrigerte meldekort er ikke behandlinger, og har alltid null.
 */
export const benkPrioritering = (behandling: BenkBehandling): Nullable<Prioritering> => {
    switch (behandling.type) {
        case BenkBehandlingstype.SØKNADSBEHANDLING:
        case BenkBehandlingstype.REVURDERING:
        case BenkBehandlingstype.MELDEKORTBEHANDLING:
        case BenkBehandlingstype.INNSENDT_MELDEKORT:
        case BenkBehandlingstype.KORRIGERT_MELDEKORT:
            return behandling.prioritering;
        default:
            return null;
    }
};
