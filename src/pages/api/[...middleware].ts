import { NextApiRequest, NextApiResponse } from 'next';
import { withAuthenticatedApi } from '../../auth/pageWithAuthentication';
import { fetchFraApiServerSide } from '../../utils/fetch-server';
import { logger } from '@navikt/next-logger';
import { FetcherError } from '../../utils/fetch';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.url) {
        const msg = 'Ingen url spesifisert for api-request';
        logger.error(msg);
        throw new Error(msg);
    }

    const path = req.url.replace('/api', '');

    try {
        const response = await fetchFraApiServerSide(req, path, {
            method: req.method,
            body: req.method === 'GET' ? undefined : req.body,
            headers: {
                'content-type': 'application/json',
            },
        });

        let responseData;
        const responseContentType = response.headers.get('content-type');

        if (responseContentType?.includes('application/json')) {
            responseData = await response.json();
        } else {
            responseData = Buffer.from(await response.arrayBuffer());
        }

        res.status(response.status);

        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        res.send(responseData);
    } catch (err: unknown) {
        console.error('Original error', err);
        if (err instanceof FetcherError && err.info) {
            res.status(err.status || 500).json(err.info);
        } else {
            res.status(500).json({ melding: 'Ukjent feil ved api-request' });
        }
    }
};

export default withAuthenticatedApi(handler);
