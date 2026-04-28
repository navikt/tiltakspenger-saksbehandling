import { MeldeperiodeKjedeId, MeldeperiodeKjedeProps } from '~/lib/meldekort/typer/Meldeperiode';
import { SakId } from '~/lib/sak/SakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    sakId: SakId;
};

export const useOpprettMeldekortbehandling = ({ kjedeId, sakId }: Props) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<MeldeperiodeKjedeProps>(
        `/sak/${encodeURIComponent(sakId)}/meldeperiode/${encodeURIComponent(kjedeId)}/opprettBehandling`,
        'POST',
    );

    return {
        opprett: trigger,
        laster: isMutating,
        feil: error,
    };
};
