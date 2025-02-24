import { NextApiRequest, NextApiResponse } from 'next';
import { withAuthenticatedApi } from '../../auth/pageWithAuthentication';
import { fetchFraApi } from '../../utils/server-fetch';
import { logger } from '@navikt/next-logger';
import { FetcherError } from '../../utils/client-fetch';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.url) {
        const msg = 'Ingen url spesifisert for api-request';
        logger.error(msg);
        throw new Error(msg);
    }

    const path = req.url.replace('/api', '');

    try {
        const response = await fetchFraApi(req, path, {
            method: req.method,
            body: req.method === 'GET' ? undefined : req.body,
            headers: {
                'content-type': 'application/json',
            },
        });

        const body = await response.json();

        res.status(response.status).json(body);
    } catch (err: unknown) {
        if (err instanceof FetcherError && err.info) {
            res.status(err.status || 500).json(err.info);
        } else {
            res.status(500).json({ melding: 'Ukjent feil ved api-request' });
        }
    }
};

export default withAuthenticatedApi(handler);
