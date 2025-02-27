import { NextApiRequest, NextApiResponse } from 'next';
import { withAuthenticatedApi } from '../../auth/pageWithAuthentication';
import { fetchFraApiServerSide } from '../../utils/fetch-server';
import { logger } from '@navikt/next-logger';

async function apiProxy(clientRequest: NextApiRequest, responseToClient: NextApiResponse) {
    if (!clientRequest.url) {
        return responseToClient.status(400).send('Ingen url spesifisert for api-request');
    }

    const path = clientRequest.url.replace('/api', '');

    const headers = new Headers();
    Object.entries(clientRequest.headers).forEach(([key, value]) => {
        headers.set(key, value as string);
    });
    headers.delete('content-length');

    await fetchFraApiServerSide(clientRequest, path, {
        method: clientRequest.method,
        headers,
        //ikke stringify ellers blir stringen escapet
        body: clientRequest.body || undefined,
    })
        .then(async (res) => {
            const data = await res.arrayBuffer();

            responseToClient.setHeaders(res.headers);
            responseToClient.status(res.status).send(Buffer.from(data));
        })
        .catch((e) => {
            logger.error(`Api-proxy fetch error: ${e}`);
            responseToClient.status(500).end();
        });
}

export default withAuthenticatedApi(apiProxy);
