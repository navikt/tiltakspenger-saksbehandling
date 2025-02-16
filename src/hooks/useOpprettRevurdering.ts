import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../utils/http';
import router from 'next/router';
import { mutate } from 'swr';
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

export function useOpprettRevurdering(sakId: SakId, saksnummer: string) {
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
    >(`/api/sak/${sakId}/revurdering`, mutateSak, {
        onSuccess: (data) => {
            mutate(`/api/sak/${saksnummer}`);
            router.push(`/behandling/${data.id}/inngangsvilkar/tiltaksdeltagelse`);
        },
    });

    return {
        opprettRevurdering,
        oppretterBehandling,
        opprettRevurderingError,
    };
}
