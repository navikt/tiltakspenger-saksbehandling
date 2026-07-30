import { skalKunneOvertaBehandling } from '~/lib/saksbehandler/tilganger';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import {
    Rammebehandling,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';

export const visOvertaBehandlingMenyvalg = (
    behandling: Rammebehandling,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erRelevantMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING;

    return (
        erRelevantMenyValgForStatus && skalKunneOvertaBehandling(behandling, innloggetSaksbehandler)
    );
};
