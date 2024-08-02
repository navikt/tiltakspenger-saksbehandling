import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';

export function useSendTilBeslutter(behandlingId: string) {
  const {
    trigger: sendTilBeslutter,
    isMutating: senderTilBeslutter,
    error: sendTilBeslutterError,
  } = useSWRMutation<any, FetcherError, any>(
    `/api/behandling/beslutter/${behandlingId}`,
    mutateBehandling,
  );

  return { sendTilBeslutter, senderTilBeslutter, sendTilBeslutterError };
}
