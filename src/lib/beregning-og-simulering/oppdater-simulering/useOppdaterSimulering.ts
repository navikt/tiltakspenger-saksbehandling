import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { SakId } from '~/lib/sak/SakTyper';
import { BehandlingId } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Rammebehandling, RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

type ResponseType<BehId extends BehandlingId> = BehId extends RammebehandlingId
    ? Rammebehandling
    : BehId extends MeldekortbehandlingId
      ? MeldeperiodeKjedeProps
      : never;

export const useOppdaterSimulering = <BehId extends BehandlingId>(
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
