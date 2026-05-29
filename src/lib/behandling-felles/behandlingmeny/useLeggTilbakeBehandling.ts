import { Rammebehandling, RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

import { SakId } from '../../sak/SakTyper';
import { useFetchJsonFraApi } from '../../../utils/fetch/useFetchFraApi';

export const useLeggTilbakeBehandling = (sakId: SakId, behandlingId: RammebehandlingId) => {
    const {
        trigger: leggTilbakeBehandling,
        isMutating: isLeggTilbakeBehandlingMutating,
        error: leggTilbakeBehandlingError,
    } = useFetchJsonFraApi<Rammebehandling>(
        `/sak/${sakId}/behandling/${behandlingId}/legg-tilbake`,
        'POST',
    );

    return { leggTilbakeBehandling, isLeggTilbakeBehandlingMutating, leggTilbakeBehandlingError };
};
