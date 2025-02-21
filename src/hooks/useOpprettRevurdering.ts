import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../utils/http';
import { SakId } from '../types/SakTypes';

type RevurderTilStansBody = { fraOgMed: string };

async function mutateSak(url: string, { arg }: { arg: RevurderTilStansBody }) {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
}

export function useOpprettRevurderingDeprecated(sakId: SakId) {
    const {
        trigger: opprettRevurdering,
        isMutating: oppretterBehandling,
        error: opprettRevurderingError,
    } = useSWRMutation<
        {
            id: string;
        },
        FetcherError,
        any,
        RevurderTilStansBody
    >(`/api/sak/${sakId}/revurdering`, mutateSak);

    return {
        opprettRevurdering,
        oppretterBehandling,
        opprettRevurderingError,
    };
}
