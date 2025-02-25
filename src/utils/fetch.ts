import { finnFetchFeilmelding } from './feilmeldinger';
import { stripLeadingSlash } from './string';

export class FetcherError extends Error {
    info?: { melding: string; kode: string };
    status: number | undefined;
}

export const errorFraApiResponse = async (res: Response) => {
    const error = new FetcherError('Noe gikk galt');

    try {
        error.info = await res.json();
        error.status = res.status || 500;
        error.message = finnFetchFeilmelding(error);
    } catch (e) {
        error.status = 500;
        error.message = 'Noe har gått galt på serversiden, kontakt utviklingsteamet.';
    }

    return error;
};

export const fetchJsonFraApiClientSide = async <ResponseType>(
    url: string,
    options?: RequestInit,
) => {
    return fetch(`/api/${stripLeadingSlash(url)}`, options)
        .then(async (res) => {
            if (res.ok) {
                return res.json() as Promise<ResponseType>;
            }

            throw await errorFraApiResponse(res);
        })
        .catch((error) => {
            console.error(`Feil ved fetch fra ${url} - [${error.status}] ${error.message}`);
            throw error;
        });
};
