import { ÅpenRammebehandlingForOversikt } from '~/types/ÅpenBehandlingForOversikt';
import { skalKunneTaBehandling } from '~/utils/tilganger';
import { Saksbehandler } from '~/types/Saksbehandler';
import { Rammebehandlingsstatus } from '~/types/Rammebehandling';

export const visTildelMegMenyvalg = (
    behandling: ÅpenRammebehandlingForOversikt,
    innloggetSaksbehandler: Saksbehandler,
) => {
    const erReleventMenyValgForStatus =
        behandling.status === Rammebehandlingsstatus.KLAR_TIL_BEHANDLING ||
        behandling.status === Rammebehandlingsstatus.KLAR_TIL_BESLUTNING;

    return erReleventMenyValgForStatus && skalKunneTaBehandling(behandling, innloggetSaksbehandler);
};
