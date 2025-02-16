import { mutate } from 'swr';
import { FetcherError, mutateVilkår } from '../../utils/http';
import { tiltaksdeltagelseBody } from '../../types/TiltakDeltagelseTypes';
import useSWRMutation from 'swr/mutation';
import { SakId } from '../../types/SakTypes';

export function useOppdaterTiltaksdeltagelse(behandlingId: string, sakId: SakId) {
    const { trigger: oppdaterTiltaksdeltagelse, isMutating: isTiltaksdeltagelseMutating } =
        useSWRMutation<any, FetcherError, any, tiltaksdeltagelseBody>(
            `/api/sak/${sakId}/behandling/${behandlingId}/vilkar/tiltaksdeltagelse`,
            mutateVilkår,
            {
                onSuccess: () => {
                    mutate(`/api/behandling/${behandlingId}/vilkar/tiltakdeltagelse`);
                    mutate(`/api/behandling/${behandlingId}`);
                },
            },
        );
    return { oppdaterTiltaksdeltagelse, isTiltaksdeltagelseMutating };
}
