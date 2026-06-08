import { MeldeperiodeKjedeId } from '~/lib/meldekort/typer/Meldeperiode';
import { SakId } from '~/lib/sak/SakTyper';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { OpprettMeldekortbehandlingDTO } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortbehandlingPropsV2 } from '~/lib/meldekort/v2/typer';

type Props = {
    kjedeId: MeldeperiodeKjedeId;
    sakId: SakId;
};

export const useOpprettMeldekortbehandlingV2 = ({ kjedeId, sakId }: Props) => {
    const { trigger, isMutating, error } = useFetchJsonFraApi<
        MeldekortbehandlingPropsV2,
        OpprettMeldekortbehandlingDTO
    >(
        `/sak/${encodeURIComponent(sakId)}/meldeperiode/${encodeURIComponent(kjedeId)}/opprettBehandling`,
        'POST',
    );

    return {
        opprett: () => trigger({ v2: true }),
        laster: isMutating,
        feil: error,
    };
};
