import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import toast from 'react-hot-toast';
import {NyBehandling} from "../types/NyBehandling";

export function useBehandling(behandlingId: string) {
    const [isLoading, setIsLoading] = useState(true);
    const [valgtBehandling, setValgBehandling] = useState<NyBehandling>();
    const { data, isLoading: isLoadingSøknader } = useSWR<NyBehandling>(`/api/behandling/${behandlingId}`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        onSuccess: (data) => {
            console.log("Data!", data)
            // if (søknadId) {
            //     setValgBehandling(data.behandlinger.find((b) => b.søknad.id === søknadId));
            // } else {
            //     setValgBehandling(data.behandlinger[0]);
            // }
        },
        onError: (error: FetcherError) => toast.error(`[${error.status}]: ${error.info}`),
    });

    // useEffect(() => {
    //     if (valgtBehandling) {
    //         setIsLoading(isLoadingSøknader);
    //     }
    // }, [isLoadingSøknader, valgtBehandling]);

    return { data, valgtBehandling, isLoading };
}

