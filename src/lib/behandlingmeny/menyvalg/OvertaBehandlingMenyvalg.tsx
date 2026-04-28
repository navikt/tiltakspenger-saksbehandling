import { ÅpenRammebehandlingForOversikt } from '~/types/ÅpenBehandlingForOversikt';
import { skalKunneOvertaBehandling } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';

export const visOvertaBehandlingMenyvalg = (
    behandling: ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erRelevantMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.UNDER_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.UNDER_BESLUTNING;

    return (
        erRelevantMenyValgForStatus && skalKunneOvertaBehandling(behandling, innloggetSaksbehandler)
    );
};
