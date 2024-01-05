import {useEffect, useState} from "react";
import useSWR from "swr";
import {fetcher, FetcherError} from "../utils/http";
import toast from "react-hot-toast";
import {Meldekort} from "../types/MeldekortTypes";

//TODO: Bruk vedtakId isf. behandlingId
export function useMeldekortEnkelt(meldekortId: string) {
    const [meldekort, setMeldekort] = useState<Meldekort>();
    const [isLoading, setIsLoading] = useState(true);
    const { data, isLoading: laster } = useSWR<Meldekort>(`/api/meldekort/hentMeldekort/${meldekortId}`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        onSuccess: (data) => {
            console.log(data);
            setMeldekort(data);
            setIsLoading(false);
        },
        onError: (error: FetcherError) => toast.error(`[${error.status}]: ${error.info}`),
    });
    return { meldekort, isLoading };
}