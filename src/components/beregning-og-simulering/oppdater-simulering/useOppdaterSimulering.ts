import { BehandlingData, BehandlingId } from '~/types/BehandlingTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldeperiodeKjedeProps } from '~/types/meldekort/Meldeperiode';
import { MeldekortBehandlingId } from '~/types/meldekort/MeldekortBehandling';
import { SakId } from '~/types/SakTypes';
import { BehandlingIdFelles } from '~/types/BehandlingFelles';

type ResponseType<BehId extends BehandlingIdFelles> = BehId extends BehandlingId
    ? BehandlingData
    : BehId extends MeldekortBehandlingId
      ? MeldeperiodeKjedeProps
      : never;

export const useOppdaterSimulering = <BehId extends BehandlingIdFelles>(
    sakId: SakId,
    behandlingId: BehId,
) => {
    const {
        trigger: oppdaterSimulering,
        isMutating: oppdaterSimuleringLaster,
        error: oppdaterSimuleringError,
    } = useFetchJsonFraApi<ResponseType<BehId>>(
        `/sak/${sakId}/behandling/${behandlingId}/oppdaterSimulering`,
        'POST',
    );

    return { oppdaterSimulering, oppdaterSimuleringLaster, oppdaterSimuleringError };
};
