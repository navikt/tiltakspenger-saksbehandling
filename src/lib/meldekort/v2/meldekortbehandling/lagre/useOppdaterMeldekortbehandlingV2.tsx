import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import {
    MeldekortbehandlingId,
    OppdaterMeldekortbehandlingDTO,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import { SakId, SakProps } from '~/lib/sak/SakTyper';

type Props = {
    sakId: SakId;
    meldekortbehandlingId: MeldekortbehandlingId;
};

export const useOppdaterMeldekortbehandlingV2 = ({ sakId, meldekortbehandlingId }: Props) => {
    return useFetchJsonFraApi<SakProps, OppdaterMeldekortbehandlingDTO>(
        `/sak/${sakId}/meldekort/${meldekortbehandlingId}/oppdater`,
        'POST',
    );
};
