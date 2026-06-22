import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { OpprettMeldekortbehandlingDTO } from '~/lib/meldekort/typer/Meldekortbehandling';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    sakId: SakId;
};

export const useOpprettMeldekortbehandling = ({ kjedeId, sakId }: Props) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<
        SakProps,
        OpprettMeldekortbehandlingDTO
    >(
        `/sak/${encodeURIComponent(sakId)}/meldeperiode/${encodeURIComponent(kjedeId)}/opprettBehandling`,
        'POST',
    );

    return {
        opprett: () => trigger({ v2: false }),
        laster: isMutating,
        feil: error,
    };
};
