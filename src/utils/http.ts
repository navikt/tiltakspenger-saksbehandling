import { logger } from '@navikt/next-logger';
import { finnFetchFeilmelding } from './feilmeldinger';
import { tiltaksdeltagelseBody } from '../types/TiltakDeltagelseTypes';
import { LivsoppholdSaksopplysningBody } from '../types/LivsoppholdTypes';

export class FetcherError extends Error {
    info?: { melding: string; kode: string };
    status: number | undefined;
}

export const fetcher = async (url: string) => {
    const res = await fetch(url);
    await throwErrorIfFatal(res);
    return res.json();
};

export async function mutateBehandling<R>(
    url: string,
    { arg }: { arg: { id: string } | { begrunnelse: string } | null },
): Promise<R> {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
}

export async function mutateVilkår<R>(
    url: string,
    { arg }: { arg: LivsoppholdSaksopplysningBody | tiltaksdeltagelseBody },
): Promise<R> {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
}

export async function sakFetcher<R>(url: string, { arg }: { arg: { fnr: string } }): Promise<R> {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
}

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
