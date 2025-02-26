import { NextApiRequest, NextApiResponse } from 'next';
import { withAuthenticatedApi } from '../../auth/pageWithAuthentication';
import { fetchFraApiServerSide } from '../../utils/fetch-server';

async function apiProxy(clientRequest: NextApiRequest, responseToClient: NextApiResponse) {
    if (!clientRequest.url) {
        const msg = 'Ingen url spesifisert for api-request';
        throw new Error(msg);
    }

    const path = clientRequest.url.replace('/api', '');

    const response = await fetchFraApiServerSide(clientRequest, path, {
        method: clientRequest.method,
        //ikke stringify ellers blir stringen escapet
        body: clientRequest.body || undefined,
    });

    const data = await response.arrayBuffer();

    responseToClient.setHeaders(response.headers);
    responseToClient.send(Buffer.from(data));
}

export default withAuthenticatedApi(apiProxy);
