import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../utils/http';
import { GodkjennDTO } from '../../types/MeldekortTypes';

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

export function useGodkjennMeldekort(meldekortId: string) {
  const { trigger: onGodkjennMeldekort, isMutating: isMeldekortMutating } =
    useSWRMutation<any, FetcherError, any, GodkjennDTO>(
      `/api/meldekort/godkjenn/${meldekortId}`,
      mutateMeldekort,
    );

  return { onGodkjennMeldekort, isMeldekortMutating };
}
