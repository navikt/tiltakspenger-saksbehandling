import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import { mutate } from 'swr';

export function useSendTilBeslutter(behandlingId: string) {
  const {
    trigger: sendTilBeslutter,
    isMutating: senderTilBeslutter,
    error: sendTilBeslutterError,
  } = useSWRMutation<any, FetcherError, any>(
    `/api/behandling/beslutter/${behandlingId}`,
    mutateBehandling,
    { onSuccess: () => mutate(`/api/behandling/${behandlingId}`) },
  );

  return { sendTilBeslutter, senderTilBeslutter, sendTilBeslutterError };
}
