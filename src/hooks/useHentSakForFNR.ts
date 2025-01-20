import { FetcherError, sakFetcher } from '../utils/http';
import { Sak } from '../types/SakTypes';
import router from 'next/router';
import useSWRMutation from 'swr/mutation';

export function useHentSakForFNR() {
    const {
        trigger: søk,
        data: sak,
        error,
    } = useSWRMutation<Sak, FetcherError, any, { fnr: string }>('/api/sak', sakFetcher, {
        onSuccess: (data) => router.push(`/sak/${data.saksnummer}`),
    });
    return { søk, sak, error };
}
