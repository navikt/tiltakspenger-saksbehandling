import useSWRMutation from 'swr/mutation';
import { FetcherError, throwErrorIfFatal } from '../../utils/http';
import { MeldekortDagDTO } from '../../types/MeldekortTypes';

export async function mutateMeldekortdag<R>(
  url,
  { arg }: { arg: MeldekortDagDTO },
): Promise<R> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  await throwErrorIfFatal(res);
  return res.json();
}

export function useOppdaterMeldekortdag() {
  const { trigger: onOppdaterDag, isMutating: isMeldekortdagMutating } =
    useSWRMutation<any, FetcherError, any, MeldekortDagDTO>(
      `/api/meldekort/oppdaterDag`,
      mutateMeldekortdag,
    );

  return { onOppdaterDag, isMeldekortdagMutating };
}
