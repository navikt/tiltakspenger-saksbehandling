import useSWRMutation from 'swr/mutation';
import router from 'next/router';
import { FetcherError, mutateBehandling } from '../utils/http';
import { BehandlingIdResponse } from '../types/Søker';

export function useTaBehandling() {
  const {
    trigger: onTaBehandling,
    isMutating: isBehandlingMutating,
    error,
  } = useSWRMutation<
    BehandlingIdResponse,
    FetcherError,
    '/api/behandling/tabehandling',
    { id: string }
  >(`/api/behandling/tabehandling`, mutateBehandling, {
    onSuccess: (data) =>
      router.push(`/behandling/${data.id}/inngangsvilkar/kravfrist`),
  });

  return { onTaBehandling, isBehandlingMutating, error };
}
