import { ÅpenRammebehandlingForOversikt } from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import { skalKunneOvertaBehandling } from '~/lib/saksbehandler/tilganger';
import { SaksbehandlerTyper } from '~/lib/saksbehandler/SaksbehandlerTyper';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';

export const visOvertaBehandlingMenyvalg = (
    behandling: ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: SaksbehandlerTyper,
) => {
    const erRelevantMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING;

    return (
        erRelevantMenyValgForStatus && skalKunneOvertaBehandling(behandling, innloggetSaksbehandler)
    );
};
