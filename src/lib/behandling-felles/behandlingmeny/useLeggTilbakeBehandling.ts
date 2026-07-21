import { SWRMutationConfiguration } from 'swr/mutation';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { SakProps } from '~/lib/sak/SakTyper';
import { FetcherError } from '~/utils/fetch/fetch';

import { SakId } from '../../sak/SakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useLeggTilbakeBehandling = (
    sakId: SakId,
    behandlingId: RammebehandlingId,
    swrOptions?: SWRMutationConfiguration<SakProps, FetcherError, string, undefined>,
) => {
    const {
        trigger: leggTilbakeBehandling,
        isMutating: isLeggTilbakeBehandlingMutating,
        error: leggTilbakeBehandlingError,
    } = useFetchJsonFraApi<SakProps>(
        `/sak/${sakId}/behandling/${behandlingId}/legg-tilbake`,
        'POST',
        swrOptions,
    );

    return { leggTilbakeBehandling, isLeggTilbakeBehandlingMutating, leggTilbakeBehandlingError };
};
