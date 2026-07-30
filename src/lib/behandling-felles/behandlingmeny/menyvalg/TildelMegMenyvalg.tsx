import { skalKunneTaBehandling } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';

export const visTildelMegMenyvalg = (
    behandling: Rammebehandling,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erReleventMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.KLAR_TIL_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.KLAR_TIL_BESLUTNING;

    return erReleventMenyValgForStatus && skalKunneTaBehandling(behandling, innloggetSaksbehandler);
};
