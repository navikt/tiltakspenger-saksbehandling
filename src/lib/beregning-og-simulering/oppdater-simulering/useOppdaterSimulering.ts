import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { SakId } from '~/lib/sak/SakTyper';
import { BehandlingIdFelles } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Rammebehandling, BehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

type ResponseType<BehId extends BehandlingIdFelles> = BehId extends BehandlingId
    ? Rammebehandling
    : BehId extends MeldekortbehandlingId
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
