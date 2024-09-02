import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../utils/http';
import { GodkjennDTO } from '../../types/MeldekortTypes';
import { MeldekortDager } from '../../components/meldekort/meldekortside/MeldekortSide';

export async function mutateMeldekort<R>(
  url,
  { arg }: { arg: GodkjennDTO },
): Promise<R> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  await throwErrorIfFatal(res);
  return res.json();
}

export function useGodkjennMeldekort(meldekortId: string, meldekortDager: MeldekortDager) {
  const {
    trigger: onGodkjennMeldekort,
    isMutating: isMeldekortMutating,
    error,
  } = useSWRMutation<any, FetcherError, any, GodkjennDTO>(
    `/api/meldekort/${meldekortId}/iverksett`,
    mutateMeldekort,
  );

  return { onGodkjennMeldekort, isMeldekortMutating, error };
}
