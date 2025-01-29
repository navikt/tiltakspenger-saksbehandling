import useSWR from 'swr';
import { MeldeperiodeKjedeProps } from '../../types/meldekort/Meldeperiode';
import { fetcher, FetcherError } from '../../utils/http';

export function useHentMeldeperiodeKjede(meldeperiodeKjedeId: string, sakId: string) {
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
