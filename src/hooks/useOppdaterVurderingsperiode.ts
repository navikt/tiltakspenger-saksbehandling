import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import { Periode } from '../types/Periode';

export function useOppdaterVurderingsperiode(behandlingId: string) {
  const {
    trigger: oppdaterVurderingsperiode,
    isMutating: oppdatererVurderingsperiode,
    error: oppdaterVurderingsperiodeError,
    reset,
  } = useSWRMutation<
    {
      id: string;
    },
    FetcherError,
    any,
    { periode: Periode }
  >(`/api/behandling/${behandlingId}/vurderingsperiode`, mutateBehandling);

  return {
    oppdaterVurderingsperiode,
    oppdatererVurderingsperiode,
    oppdaterVurderingsperiodeError,
    reset,
  };
}
