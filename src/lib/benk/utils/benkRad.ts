import { Nullable } from '~/types/UtilTypes';
import { Prioritering } from '~/lib/_felles/prioritering/prioriteringTyper';
import {
    BenkBehandling,
    BenkBehandlingMedTilgang,
    BenkBehandlingstype,
    BenkTilgangsvurdering,
} from '../typer/felles';

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
