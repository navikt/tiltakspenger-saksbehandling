import useSWR, { mutate } from 'swr';
import { fetcher, throwErrorIfFatal } from '../../utils/http';
import {
  LivsoppholdSaksopplysningBody,
  LivsoppholdVilkår,
} from '../../types/LivsoppholdTypes';

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

export function useHentLivsopphold(behandlingId: string) {
  const {
    data: livsopphold,
    isLoading,
    error,
  } = useSWR<LivsoppholdVilkår>(
    `/api/behandling/${behandlingId}/vilkar/livsopphold`,
    fetcher,
  );
  return { livsopphold, isLoading, error, mutate };
}
