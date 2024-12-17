import useSWRMutation from 'swr/mutation';

import { LivsoppholdSaksopplysningBody } from '../../types/LivsoppholdTypes';
import { FetcherError, mutateVilkår } from '../../utils/http';
import { mutate } from 'swr';

export function useLagreLivsoppholdSaksopplysning(behandlingId: string) {
  const { trigger: onLagreLivsopphold, isMutating: isLivsoppholdMutating } =
    useSWRMutation<any, FetcherError, any, LivsoppholdSaksopplysningBody>(
      `/api/behandling/${behandlingId}/vilkar/livsopphold`,
      mutateVilkår,
      { onSuccess: () => mutate(`/api/behandling/${behandlingId}`) },
    );
  return { onLagreLivsopphold, isLivsoppholdMutating };
}
