import useSWR from 'swr';
import { fetchJsonFraApiClientSide } from '~/utils/fetch/fetch';

export type ValiderJournalpostBody = {
    fnr: string;
    journalpostId: string;
};

export type ValiderJournalpostResponse = {
    journalpostFinnes: boolean;
    gjelderInnsendtFnr?: boolean;
    datoOpprettet?: string;
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
