import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import router from 'next/router';

export function useSendTilBeslutter(behandlingId: string) {
  const {
    trigger: sendTilBeslutter,
    isMutating: senderTilBeslutter,
    error: sendTilBeslutterError,
  } = useSWRMutation<any, FetcherError, any>(
    `/api/behandling/beslutter/${behandlingId}`,
    mutateBehandling,
    { onSuccess: () => router.push('/') },
  );

  return { sendTilBeslutter, senderTilBeslutter, sendTilBeslutterError };
}
