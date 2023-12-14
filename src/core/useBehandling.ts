import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import toast from 'react-hot-toast';
import { Behandling } from '../types/Behandling';

export function useBehandling(behandlingId: string) {
    const [valgtBehandling, setValgtBehandling] = useState<Behandling>();
    const { data, isLoading } = useSWR<Behandling>(`/api/behandling/${behandlingId}`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        onSuccess: (data) => {
            console.log(data);
            setValgtBehandling(data);
        },
        onError: (error: FetcherError) => toast.error(`[${error.status}]: ${error.info}`),
    });
    return { valgtBehandling, isLoading };
}
