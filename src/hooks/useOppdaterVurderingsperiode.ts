import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import { Periode } from '../types/Periode';
import { mutate } from 'swr';

export function useOppdaterVurderingsperiode(behandlingId: string) {
  const {
    trigger: oppdaterVurderingsperiode,
    isMutating: oppdatererVurderingsperiode,
    error: oppdaterVurderingsperiodeError,
  } = useSWRMutation<
    {
      id: string;
    },
    FetcherError,
    any,
    { periode: Periode }
  >(`/api/behandling/${behandlingId}/vurderingsperiode`, mutateBehandling, {
    onSuccess: () => {
      mutate(`/api/behandling/${behandlingId}`);
    },
  });

  return {
    oppdaterVurderingsperiode,
    oppdatererVurderingsperiode,
    oppdaterVurderingsperiodeError,
  };
}
