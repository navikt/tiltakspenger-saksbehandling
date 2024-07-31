import { FetcherError, mutateBehandling } from '../utils/http';
import useSWRMutation from 'swr/mutation';
import router from 'next/router';
import { BehandlingIdResponse } from '../types/Søker';

export function useOpprettBehandling() {
  const { trigger: onOpprettBehandling, isMutating: isSøknadMutating } =
    useSWRMutation<
      BehandlingIdResponse,
      FetcherError,
      '/api/behandling/startbehandling',
      { id: string }
    >('/api/behandling/startbehandling', mutateBehandling, {
      onSuccess: (data) =>
        router.push(`/behandling/${data.id}/inngangsvilkar/kravfrist`),
    });

  return { onOpprettBehandling, isSøknadMutating };
}
