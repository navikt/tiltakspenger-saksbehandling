import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import router from 'next/router';
import { mutate } from 'swr';

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
        mutate(`/api/behandling/${behandlingId}`);
      },
    },
  );

  return { sendTilbakeBehandling, senderTilbake, sendTilbakeBehandlingError };
}
