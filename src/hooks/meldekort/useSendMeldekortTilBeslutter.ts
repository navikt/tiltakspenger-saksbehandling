import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateMeldekort } from '../../utils/http';
import router from 'next/router';
import { MeldekortDTO } from '../../types/MeldekortTypes';

export function useSendMeldekortTilBeslutter(
  meldekortId: string,
  sakId: string,
) {
  const {
    trigger: sendMeldekortTilBeslutter,
    isMutating: senderMeldekortTilBeslutter,
    error,
  } = useSWRMutation<any, FetcherError, any, MeldekortDTO>(
    `/api/sak/${sakId}/meldekort/${meldekortId}`,
    mutateMeldekort,
    { onSuccess: () => router.push('/') },
  );

  return {
    sendMeldekortTilBeslutter,
    senderMeldekortTilBeslutter,
    error,
  };
}
