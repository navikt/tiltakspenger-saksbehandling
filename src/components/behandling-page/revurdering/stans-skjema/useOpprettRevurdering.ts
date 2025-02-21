import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../../../utils/http';
import { SakId } from '../../../../types/SakTypes';

export const useOpprettRevurdering = (sakId: SakId) => {
    const {
        trigger: opprettRevurdering,
        isMutating: opprettRevurderingLaster,
        error: opprettRevurderingError,
    } = useSWRMutation<
        {
            id: string;
        },
        FetcherError,
        string
    >(`/api/sak/${sakId}/revurdering/start`, fetchOpprettRevurdering);

    return {
        opprettRevurdering,
        opprettRevurderingLaster,
        opprettRevurderingError,
    };
};

const fetchOpprettRevurdering = async (url: string) => {
    const res = await fetch(url, {
        method: 'POST',
    });
    await throwErrorIfFatal(res);
    return res.json();
};
