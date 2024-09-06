import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../utils/http';
import router from 'next/router';

export async function mutateMeldekort<R>(
  url,
  { arg }: { arg: any },
): Promise<R> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  await throwErrorIfFatal(res);
  return res.json();
}

export function useGodkjennMeldekort(meldekortId: string, sakId: string) {
  const {
    trigger: onGodkjennMeldekort,
    isMutating: isMeldekortMutating,
    error,
  } = useSWRMutation<any, FetcherError, any, any>(
    `/api/sak/${sakId}/meldekort/${meldekortId}/iverksett`,
    mutateMeldekort,
    { onSuccess: () => router.push('/') },
  );

  return { onGodkjennMeldekort, isMeldekortMutating, error };
}
