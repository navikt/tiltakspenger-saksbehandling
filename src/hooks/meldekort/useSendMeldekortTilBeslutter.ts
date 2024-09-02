import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../../utils/http';
import router from 'next/router';

export function useSendMeldekortTilBeslutter(meldekortId: string) {
  const {
    trigger: sendMeldekortTilBeslutter,
    isMutating: senderMeldekortTilBeslutter,
    error: sendMeldekortTilBeslutterError,
  } = useSWRMutation<any, FetcherError, any>(
    `/api/vedtak/meldekort/${meldekortId}/beslutter`,
    mutateBehandling,
    { onSuccess: () => router.push('/') },
  );

  return {
    sendMeldekortTilBeslutter,
    senderMeldekortTilBeslutter,
    sendMeldekortTilBeslutterError,
  };
}
