import useSWR from 'swr';
import { fetchJsonFraApiClientSide } from '~/utils/fetch/fetch';
import { Tidspunkt } from '~/types/DatoTid';

export type ValiderJournalpostBody = {
    fnr: string;
    journalpostId: string;
};

export type ValiderJournalpostResponse = {
    journalpostFinnes: boolean;
    gjelderInnsendtFnr?: boolean;
    datoOpprettet?: Tidspunkt;
};

const fetcher = (body: ValiderJournalpostBody) =>
    fetchJsonFraApiClientSide<ValiderJournalpostResponse>(`/journalpost/valider`, {
        method: 'POST',
        body: JSON.stringify(body),
    });

export const useValiderJournalpostId = (body: ValiderJournalpostBody) => {
    const shouldFetch = !!body.fnr && !!body.journalpostId;
    const { data, isLoading, error, mutate } = useSWR<ValiderJournalpostResponse>(
        shouldFetch ? ['validerJournalpost', body.fnr, body.journalpostId] : null,
        () => fetcher(body),
    );

    return { data, isLoading, error, mutate };
};
