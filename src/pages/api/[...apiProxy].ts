import { NextApiRequest, NextApiResponse } from 'next';
import { withAuthenticatedApi } from '../../auth/pageWithAuthentication';
import { logger } from '@navikt/next-logger';
import { hentOboToken, SBH_API_URL } from '../../utils/fetch-server';

async function apiProxy(clientRequest: NextApiRequest, responseToClient: NextApiResponse) {
    if (!clientRequest.url) {
        const msg = 'Ingen url spesifisert for api-request';
        throw new Error(msg);
    }

    const path = clientRequest.url.replace('/api', '');
    const oboToken = await hentOboToken(clientRequest);

    const headers = new Headers();
    Object.entries(clientRequest.headers).forEach(([key, value]) => {
        headers.set(key, value as string);
    });
    headers.set('Authorization', `Bearer ${oboToken}`);
    headers.delete('content-length');
    headers.set('content-type', 'application/json');

    const url = `${SBH_API_URL}/${path.replace(/^\//, '')}`;

    const response = await fetch(url, {
        method: clientRequest.method,
        //ikke stringify ellers blir stringen escapet
        body: clientRequest.body ? clientRequest.body : undefined,
        headers: headers,
    }).catch((error) => {
        logger.error('Feil ved fetch fra saksbehandling-api: ', error);
        throw error;
    });

    responseToClient.status(response.status);
    response.headers.forEach((value, key) => {
        responseToClient.setHeader(key, value);
    });
    const data = await response.arrayBuffer();
    responseToClient.send(Buffer.from(data));
}

export default withAuthenticatedApi(apiProxy);
