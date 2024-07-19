import useSWR, { mutate } from 'swr';
import { InstitusjonsoppholdVilkår } from '../../types/InstitusjonsoppholdTypes';
import { fetcher } from '../../utils/http';

export function useHentInstitusjonsopphold(behandlingId: string) {
  const {
    data: institusjonsopphold,
    isLoading,
    error,
  } = useSWR<InstitusjonsoppholdVilkår>(
    `/api/behandling/${behandlingId}/vilkar/institusjonsopphold`,
    fetcher,
  );
  return { institusjonsopphold, isLoading, error, mutate };
}
