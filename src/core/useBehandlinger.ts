import { useState } from 'react';
import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import toast from 'react-hot-toast';

export function useBehandling() {
  const [behandlinger, setBehandlinger] = useState<string[]>([]);
  const { data, isLoading } = useSWR<string[]>(`/api/behandlinger`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onSuccess: (data) => {
      console.log(data);
      setBehandlinger(data);
    },
    onError: (error: FetcherError) =>
      toast.error(`[${error.status}]: ${error.info}`),
  });
  return { behandlinger, isLoading };
}
