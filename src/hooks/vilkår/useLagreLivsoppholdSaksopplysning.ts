import useSWRMutation from 'swr/mutation';

import { LivsoppholdSaksopplysningBody } from '../../types/LivsoppholdTypes';
import { FetcherError, mutateLivsopphold } from '../../utils/http';

export function useLagreLivsoppholdSaksopplysning(behandlingId: string) {
  const { trigger: onLagreLivsopphold, isMutating: isLivsoppholdMutating } =
    useSWRMutation<any, FetcherError, any, LivsoppholdSaksopplysningBody>(
      `/api/behandling/${behandlingId}/vilkar/livsopphold`,
      mutateLivsopphold,
    );

  return { onLagreLivsopphold, isLivsoppholdMutating };
}
