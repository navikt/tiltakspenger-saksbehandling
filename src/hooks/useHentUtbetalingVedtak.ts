import useSWR from 'swr';
import { fetcher } from '../utils/http';
import {UtbetalingVedtak} from "../types/Utbetaling";

export function useHentUtbetalingVedtak(utbetalingVedtakId?: string) {
    const {
        data: utbetalingVedtak,
        isLoading,
        error,
    } = useSWR<UtbetalingVedtak>(
        `/api/utbetaling/hentVedtak/${utbetalingVedtakId}`,
        fetcher
    );
    return { utbetalingVedtak, isLoading, error };
}
