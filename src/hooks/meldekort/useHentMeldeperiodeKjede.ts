import useSWR from 'swr';
import { MeldeperiodeKjedeProps } from '../../types/Meldeperiode';
import { fetcher, FetcherError } from '../../utils/http';

export function useHentMeldeperiodeKjede(meldeperiodeKjedeId: string, sakId: string) {
    const { data, mutate, isLoading, error } = useSWR<MeldeperiodeKjedeProps, FetcherError>(
        meldeperiodeKjedeId &&
            sakId &&
            `/api/sak/${sakId}/meldeperiode/${encodeURIComponent(meldeperiodeKjedeId)}`,
        fetcher,
    );

    return { meldeperiodeKjede: data, isLoading, error, mutate };
}
