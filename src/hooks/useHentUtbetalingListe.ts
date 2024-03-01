import useSWR from 'swr';
import { fetcher } from '../utils/http';
import {UtbetalingListe} from "../types/Utbetaling";

export function useHentUtbetalingListe(behandlingId: string) {
    const {
        data: utbetalingListe,
        isLoading,
        error,
    } = useSWR<UtbetalingListe[]>(
        `/api/utbetaling/hentAlleForBehandling/${behandlingId}`,
        fetcher
    );
    return { utbetalingListe, isLoading, error };
}
