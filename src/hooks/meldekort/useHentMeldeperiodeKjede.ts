import useSWR from 'swr';
import { MeldeperiodeKjedeId, MeldeperiodeKjedeProps } from '../../types/meldekort/Meldeperiode';
import { SakId } from '../../types/SakTypes';

import { fetcher, FetcherError } from '../../utils/client-fetch';

export function useHentMeldeperiodeKjede(meldeperiodeKjedeId: MeldeperiodeKjedeId, sakId: SakId) {
    const { data, mutate, isLoading, error, isValidating } = useSWR<
        MeldeperiodeKjedeProps,
        FetcherError
    >(
        meldeperiodeKjedeId &&
            sakId &&
            `/api/sak/${sakId}/meldeperiode/${encodeURIComponent(meldeperiodeKjedeId)}`,
        fetcher,
    );

    return {
        meldeperiodeKjede: data,
        laster: isLoading || isValidating,
        error,
        revalider: mutate,
    };
}
