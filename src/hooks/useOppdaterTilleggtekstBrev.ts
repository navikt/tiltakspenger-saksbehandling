import useSWRMutation from 'swr/mutation';
import { FetcherError, mutateBehandling } from '../utils/http';
import { Subsumsjon } from '../types/BehandlingTypes';
import { mutate } from 'swr';

export function useOppdaterTilleggtekstBrev(behandlingId: string) {
  const {
    trigger: oppdaterTilleggstekst,
    isMutating: oppdaterTilleggstekstMutating,
    error: oppdaterTilleggstekstError,
    reset: oppdaterTilleggstekstReset,
  } = useSWRMutation<
    {
      id: string;
    },
    FetcherError,
    any,
    { subsumsjon: Subsumsjon }
  >(`/api/behandling/${behandlingId}/tilleggstekst`, mutateBehandling, {
    onSuccess: () => {
      mutate(`/api/behandling/${behandlingId}`);
    },
  });

  return {
    oppdaterTilleggstekst,
    oppdaterTilleggstekstMutating,
    oppdaterTilleggstekstError,
    oppdaterTilleggstekstReset,
  };
}
