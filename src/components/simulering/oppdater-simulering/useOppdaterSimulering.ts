import { AlleBehandlingData } from '~/types/BehandlingTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useOppdaterSimulering = <Behandling extends AlleBehandlingData>(
    behandling: Behandling,
) => {
    const {
        trigger: oppdaterSimulering,
        isMutating: oppdaterSimuleringLaster,
        error: oppdaterSimuleringError,
    } = useFetchJsonFraApi<Behandling>(
        `/sak/${behandling.sakId}/behandling/${behandling.id}/oppdaterSimulering`,
        'POST',
    );

    return { oppdaterSimulering, oppdaterSimuleringLaster, oppdaterSimuleringError };
};
