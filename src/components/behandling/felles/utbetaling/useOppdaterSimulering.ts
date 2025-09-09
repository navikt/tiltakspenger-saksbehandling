import { AlleBehandlingData, BehandlingId } from '~/types/BehandlingTypes';
import { MeldekortBehandlingId } from '~/types/meldekort/MeldekortBehandling';
import { SakId } from '~/types/SakTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useOppdaterSimulering = (
    sakId: SakId,
    behandlingId: BehandlingId | MeldekortBehandlingId,
) => {
    const {
        trigger: oppdaterSimulering,
        isMutating: isOppdaterSimuleringMutating,
        error: oppdaterSimuleringError,
    } = useFetchJsonFraApi<AlleBehandlingData>(
        `/sak/${sakId}/behandling/${behandlingId}/oppdaterSimulering`,
        'POST',
    );

    return { oppdaterSimulering, isOppdaterSimuleringMutating, oppdaterSimuleringError };
};
