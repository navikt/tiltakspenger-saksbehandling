import useSWR from 'swr';
import { MeldeperiodeKjede } from '../../types/MeldekortTypes';
import { fetcher, FetcherError } from '../../utils/http';

export function useHentMeldeperiodeKjede(meldeperiodeId: string, sakId: string) {
    const {
        data: meldekort,
        mutate,
        isLoading,
        error,
    } = useSWR<MeldeperiodeKjede, FetcherError>(
        meldeperiodeId &&
            sakId &&
            `/api/sak/${sakId}/meldeperiode/${encodeURIComponent(meldeperiodeId)}`,
        fetcher,
    );

    return { meldeperiodeKjede: meldekort, isLoading, error, mutate };
}
