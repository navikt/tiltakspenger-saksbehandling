import useSWRMutation from 'swr/mutation';

import { LivsoppholdSaksopplysningBody } from '../../types/LivsoppholdTypes';
import { FetcherError, throwErrorIfFatal } from '../../utils/http';

export async function mutateLivsopphold<R>(
  url,
  { arg }: { arg: LivsoppholdSaksopplysningBody },
): Promise<R> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  await throwErrorIfFatal(res);
  return res.json();
}

export function useLagreLivsoppholdSaksopplysning(behandlingId: string) {
  const { trigger: onLagreLivsopphold, isMutating: isLivsoppholdMutating } =
    useSWRMutation<any, FetcherError, any, LivsoppholdSaksopplysningBody>(
      `/api/behandling/${behandlingId}/vilkar/livsopphold`,
      mutateLivsopphold,
    );

  return { onLagreLivsopphold, isLivsoppholdMutating };
}
