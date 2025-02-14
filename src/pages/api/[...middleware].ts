import { NextApiRequest, NextApiResponse } from 'next';
import { withAuthenticatedApi } from '../../auth/pageWithAuthentication';
import { FetcherError } from '../../utils/http';
import { hentOboToken } from '../../utils/auth';
import { logger } from '@navikt/next-logger';

const SBH_API_URL = process.env.TILTAKSPENGER_SAKSBEHANDLING_API_URL || '';

const makeApiRequest = async (request: NextApiRequest, oboToken: string): Promise<Response> => {
    if (!request.url) {
        const msg = 'Ingen url spesifisert for api-request';
        logger.error(msg);
        throw new Error(msg);
    }

    const path = request.url.replace('/api', '');
    const url = `${SBH_API_URL}${path}`;

    logger.info(`Sender api-request til ${url}`);

    return fetch(url, {
        method: request.method,
        body: request.method === 'GET' ? undefined : request.body,
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${oboToken}`,
        },
    }).catch((error) => {
        logger.error('Fikk ikke kontakt med APIet', error);
        throw error;
    });
};

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const oboToken = await hentOboToken(req);

    try {
        const response = await makeApiRequest(req, oboToken);
        const body = await response.json();

        res.status(response.status).json(body);
    } catch (err: unknown) {
        if (err instanceof FetcherError && err.info) {
            res.status(err.status || 500).json(err.info);
        } else {
            res.status(500).json({ melding: 'Ukjent feil ved api-request' });
        }
    }
}

export default withAuthenticatedApi(handler);
