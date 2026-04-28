import {
    MeldekortbehandlingId,
    MeldekortbehandlingProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { SakId } from '~/lib/sak/SakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

export const useTaMeldekortbehandling = (
    sakId: SakId,
    meldekortbehandlingId: MeldekortbehandlingId,
) => {
    const {
        trigger: taMeldekortbehandling,
        isMutating: isMeldekortbehandlingMutating,
        error: taMeldekortbehandlingError,
    } = useFetchJsonFraApi<MeldekortbehandlingProps>(
        `/sak/${sakId}/meldekort/${meldekortbehandlingId}/ta`,
        'POST',
    );

    return { taMeldekortbehandling, isMeldekortbehandlingMutating, taMeldekortbehandlingError };
};
