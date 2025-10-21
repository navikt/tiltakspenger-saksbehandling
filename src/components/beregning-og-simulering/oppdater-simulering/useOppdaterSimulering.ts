import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldeperiodeKjedeProps } from '~/types/meldekort/Meldeperiode';
import { MeldekortBehandlingId } from '~/types/meldekort/MeldekortBehandling';
import { SakId } from '~/types/Sak';
import { BehandlingIdFelles } from '~/types/BehandlingFelles';
import { Behandling, BehandlingId } from '~/types/Behandling';

type ResponseType<BehId extends BehandlingIdFelles> = BehId extends BehandlingId
    ? Behandling
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
