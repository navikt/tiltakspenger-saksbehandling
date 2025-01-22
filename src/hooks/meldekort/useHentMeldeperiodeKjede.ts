import useSWR from 'swr';
import { MeldeperiodeKjedeProps } from '../../types/MeldekortTypes';
import { fetcher, FetcherError } from '../../utils/http';

export function useHentMeldeperiodeKjede(meldeperiodeId: string, sakId: string) {
    const { data, mutate, isLoading, error } = useSWR<MeldeperiodeKjedeProps, FetcherError>(
        meldeperiodeId &&
            sakId &&
            `/api/sak/${sakId}/meldeperiode/${encodeURIComponent(meldeperiodeId)}`,
        fetcher,
    );

    return { meldeperiodeKjede: data, isLoading, error, mutate };
}
