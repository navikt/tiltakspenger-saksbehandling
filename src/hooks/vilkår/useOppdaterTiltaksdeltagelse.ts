import { mutate } from 'swr';
import { FetcherError, mutateVilkår } from '../../utils/http';
import { tiltaksdeltagelseBody } from '../../types/TiltakDeltagelseTypes';
import useSWRMutation from 'swr/mutation';

export function useOppdaterTiltaksdeltagelse(
  behandlingId: string,
  sakId: string,
) {
  const {
    trigger: oppdaterTiltaksdeltagelse,
    isMutating: isTiltaksdeltagelseMutating,
  } = useSWRMutation<any, FetcherError, any, tiltaksdeltagelseBody>(
    `/api/sak/${sakId}/behandling/${behandlingId}/vilkar/tiltaksdeltagelse`,
    mutateVilkår,
    {
      onSuccess: () =>
        mutate(`/api/behandling/${behandlingId}/vilkar/tiltakdeltagelse`),
    },
  );
  return { oppdaterTiltaksdeltagelse, isTiltaksdeltagelseMutating };
}
