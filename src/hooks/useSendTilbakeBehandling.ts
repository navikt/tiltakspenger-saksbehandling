import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import router from 'next/router';

export function useSendTilbakeBehandling(behandlingId: string) {
  const {
    trigger: sendTilbakeBehandling,
    isMutating: senderTilbake,
    error: sendTilbakeBehandlingError,
  } = useSWRMutation<any, FetcherError, any, { begrunnelse: string }>(
    `/api/behandling/sendtilbake/${behandlingId}`,
    mutateBehandling,
    {
      onSuccess: () => {
        router.push('/');
      },
    },
  );

  return { sendTilbakeBehandling, senderTilbake, sendTilbakeBehandlingError };
}
