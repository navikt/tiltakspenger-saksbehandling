import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import { Behandling, BehandlingStatus } from '../types/BehandlingTypes';
import router from 'next/router';
import { mutate } from 'swr';

export const finnLenke = (behandlingId: string, status: BehandlingStatus) => {
  switch (status) {
    case BehandlingStatus.KLAR_TIL_BEHANDLING:
    case BehandlingStatus.UNDER_BEHANDLING:
      return `/behandling/${behandlingId}/inngangsvilkar/kravfrist`;
    case BehandlingStatus.KLAR_TIL_BESLUTNING:
    case BehandlingStatus.UNDER_BESLUTNING:
      return `/behandling/${behandlingId}/oppsummering`;
    default:
      return '/';
  }
};

export function useTaBehandling() {
  const {
    trigger: onTaBehandling,
    isMutating: isBehandlingMutating,
    error: taBehandlingError,
  } = useSWRMutation<
    Behandling,
    FetcherError,
    '/api/behandling/tabehandling',
    { id: string }
  >(`/api/behandling/tabehandling`, mutateBehandling, {
    onSuccess: (data) => {
      mutate('/api/behandlinger');
      router.push(finnLenke(data.id, data.status));
    },
  });

  return { onTaBehandling, isBehandlingMutating, taBehandlingError };
}
