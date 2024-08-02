import useSWR from 'swr';
import { MeldekortBeregningDTO } from '../../types/MeldekortTypes';
import { fetcher } from '../../utils/http';

export function useHentMeldekortBeregning(meldekortId?: string) {
  const {
    data: meldekortBeregning,
    mutate,
    isLoading,
    error,
  } = useSWR<MeldekortBeregningDTO>(
    meldekortId && `/api/meldekort/hentBeregning/${meldekortId}`,
    fetcher,
  );

  return { meldekortBeregning, mutate, isLoading, error };
}
