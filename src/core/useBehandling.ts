import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import toast from 'react-hot-toast';
import {NyBehandling} from "../types/NyBehandling";

export function useBehandling(behandlingId: string) {
    const [valgtBehandling, setValgtBehandling] = useState<NyBehandling>();
    const { data, isLoading } = useSWR<NyBehandling>(`/api/behandling/${behandlingId}`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        onSuccess: (data) => {
            setValgtBehandling(data)
        },
        onError: (error: FetcherError) => toast.error(`[${error.status}]: ${error.info}`),
    });
    return { data, valgtBehandling, isLoading };
}

