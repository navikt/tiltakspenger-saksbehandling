import { logger } from '@navikt/next-logger';
import { NextApiRequest } from 'next';
import { MeldekortDTO } from '../types/MeldekortTypes';
import { finnFeilmelding } from './feilmeldinger';
import { Periode } from '../types/Periode';
import { tiltaksdeltagelseBody } from '../types/TiltakDeltagelseTypes';
import { LivsoppholdSaksopplysningBody } from '../types/LivsoppholdTypes';
import { Subsumsjon } from '../types/BehandlingTypes';

const backendUrl = process.env.TILTAKSPENGER_SAKSBEHANDLING_API_URL || '';

export class FetcherError extends Error {
    info: { melding: string; kode: string };
    status: number | undefined;
}

export const fetcher = async (url: string) => {
    const res = await fetch(url);
    await throwErrorIfFatal(res);
    return res.json();
};

export async function mutateBehandling<R>(
    url,
    {
        arg,
    }: {
        arg: { id: string } | { periode: Periode } | { subsumsjon: Subsumsjon } | null;
    },
): Promise<R> {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
}

export async function mutateVilkår<R>(
    url,
    { arg }: { arg: LivsoppholdSaksopplysningBody | tiltaksdeltagelseBody },
): Promise<R> {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
}

export async function mutateSak<R>(url, { arg }: { arg: { periode: Periode } }): Promise<R> {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
}

export async function mutateMeldekort<R>(url, { arg }: { arg: MeldekortDTO }): Promise<R> {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    await throwErrorIfFatal(res);
    return res.json();
}

export async function sakFetcher<R>(url, { arg }: { arg: { fnr: string } }): Promise<R> {
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
            error.message =
                finnFeilmelding(error.info.kode, error.info.melding) ??
                'Noe har gått galt på serversidenn';
        } catch (e) {
            error.status = 500;
            error.message = 'Noe har gått galt på serversiden, kontakt utviklingsteamet.';
        }

        logger.error(error.message);

        throw error;
    }
};

export async function makeApiRequest(request: NextApiRequest, oboToken: string): Promise<Response> {
    const path = request.url.replace('/api', '');
    const url = `${backendUrl}${path}`;

    logger.info(`Sender request til ${url}`);

    try {
        return await fetch(url, {
            method: request.method,
            body: request.method === 'GET' ? undefined : request.body,
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${oboToken}`,
            },
        });
    } catch (error) {
        logger.error('Fikk ikke kontakt med APIet', error);
    }
}
