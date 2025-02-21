import { logger } from '@navikt/next-logger';
import { finnFetchFeilmelding } from './feilmeldinger';

export class FetcherError extends Error {
    info?: { melding: string; kode: string };
    status: number | undefined;
}

export const fetcher = async (url: string) => {
    const res = await fetch(url);
    await throwErrorIfFatal(res);
    return res.json();
};

export const throwErrorIfFatal = async (res: Response) => {
    if (!res.ok) {
        const error = new FetcherError('Noe gikk galt');
        try {
            error.info = await res.json();
            error.status = res.status || 500;
            error.message = finnFetchFeilmelding(error);
        } catch (e) {
            error.status = 500;
            error.message = 'Noe har gått galt på serversiden, kontakt utviklingsteamet.';
        }

        logger.error('Fetcher error: ', error.message);

        throw error;
    }
};
