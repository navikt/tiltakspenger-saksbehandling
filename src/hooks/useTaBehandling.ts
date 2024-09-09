import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import { BehandlingIdResponse } from '../types/BehandlingTypes';
import router from 'next/router';

export function useTaBehandling(lenke: string) {
  const {
    trigger: onTaBehandling,
    isMutating: isBehandlingMutating,
    error: taBehandlingError,
  } = useSWRMutation<
    BehandlingIdResponse,
    FetcherError,
    '/api/behandling/tabehandling',
    { id: string }
  >(`/api/behandling/tabehandling`, mutateBehandling, {
    onSuccess: () => router.push(lenke),
  });

  return { onTaBehandling, isBehandlingMutating, taBehandlingError };
}
