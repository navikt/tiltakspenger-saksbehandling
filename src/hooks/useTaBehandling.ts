import useSWRMutation from 'swr/mutation';
import router from 'next/router';
import { FetcherError, mutateBehandling } from '../utils/http';
import { BehandlingIdResponse } from '../types/BehandlingTypes';

export function useTaBehandling() {
  const {
    trigger: onTaBehandling,
    isMutating: isBehandlingMutating,
    error: taBehandlingError,
  } = useSWRMutation<
    BehandlingIdResponse,
    FetcherError,
    '/api/behandling/tabehandling',
    { id: string }
  >(`/api/behandling/tabehandling`, mutateBehandling, {});

  return { onTaBehandling, isBehandlingMutating, taBehandlingError };
}
