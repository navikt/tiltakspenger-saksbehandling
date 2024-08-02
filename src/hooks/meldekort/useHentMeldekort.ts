import useSWR from 'swr';
import { Meldekort } from '../../types/MeldekortTypes';
import { fetcher } from '../../utils/http';

export function useHentMeldekort(meldekortId?: string) {
  const {
    data: meldekort,
    mutate,
    isLoading,
    error,
  } = useSWR<Meldekort>(
    meldekortId && `/api/meldekort/hentMeldekort/${meldekortId}`,
    fetcher,
  );

  return { meldekort, isLoading, error, mutate };
}
