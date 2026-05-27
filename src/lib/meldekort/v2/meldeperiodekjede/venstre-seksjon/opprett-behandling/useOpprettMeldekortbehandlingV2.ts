import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import {
    MeldekortbehandlingType,
    OpprettMeldekortbehandlingDTO,
} from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    sakId: SakId;
    type: MeldekortbehandlingType;
};

export const useOpprettMeldekortbehandlingV2 = ({ kjedeId, sakId, type }: Props) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<
        SakProps,
        OpprettMeldekortbehandlingDTO
    >(
        `/sak/${encodeURIComponent(sakId)}/meldeperiode/${encodeURIComponent(kjedeId)}/opprettBehandling`,
        'POST',
    );

    return {
        opprett: () => trigger({ v2: true, type }),
        laster: isMutating,
        feil: error,
    };
};
