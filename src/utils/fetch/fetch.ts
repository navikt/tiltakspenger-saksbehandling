import { finnFetchFeilmelding } from '../feilmeldinger';
import { stripLeadingSlash } from '../string';
import { Rammebehandling } from '~/types/Rammebehandling';

type ErrorContructorProps<Data = unknown> = {
    status: number;
    message: string;
    data?: Data;
};

export type JsonError<Data = unknown> = {
    kode: string;
    melding: string;
    data?: Data;
};

export class FetcherError<Data = unknown> extends Error {
    status?: number;
    data?: Data;

    constructor({ status, message, data }: ErrorContructorProps<Data>) {
        super();
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

export const errorFraApiResponse = async <Data = unknown>(res: Response) => {
    try {
        const json = await res.json();

        return new FetcherError({
            status: res.status,
            message: finnFetchFeilmelding(json),
            data: json.data
        });
    } catch {
        return new FetcherError({
            status: 500,
            message: 'Noe har gått galt på serversiden, kontakt utviklingsteamet.',
        });
    }
};

export const fetchFraApiClientSide = async (url: string, options?: RequestInit) => {
    return fetch(`/api/${stripLeadingSlash(url)}`, {
        ...options,
        headers: {
            'content-type': 'application/json',
            ...options?.headers,
        },
    })
        .then(async (res) => {
            if (res.ok) {
                return res;
            }

            throw await errorFraApiResponse(res);
        })
        .catch((error) => {
            console.error(`Feil ved fetch fra ${url} - [${error.status}] ${error.message}`);
            throw error;
        });
};

export const fetchJsonFraApiClientSide = async <ResponseType>(
    url: string,
    options?: RequestInit,
) => {
    return fetchFraApiClientSide(url, options).then((res) => res.json() as Promise<ResponseType>);
};

export const fetchBlobFraApiClientSide = async (url: string, options?: RequestInit) => {
    return fetchFraApiClientSide(url, options).then((res) => res.blob());
};
