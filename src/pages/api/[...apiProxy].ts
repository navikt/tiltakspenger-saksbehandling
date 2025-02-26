import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFraApi } from '../../utils/server-fetch';
import { getToken, requestOboToken } from '@navikt/oasis';
import { withAuthenticatedApi } from '../../auth/pageWithAuthentication';

const SBH_API_URL = process.env.TILTAKSPENGER_SAKSBEHANDLING_API_URL;
const SBH_API_SCOPE = process.env.SAKSBEHANDLING_API_SCOPE;

const hentOboToken = async (req: NextApiRequest) => {
    const token = getToken(req);
    if (!token) {
        throw new Error('Kunne ikke hente token!');
    }

    const obo = await requestOboToken(token, SBH_API_SCOPE);
    if (!obo.ok) {
        throw new Error(`Kunne ikke gjøre on-behalf-of-utveksling for saksbehandlertoken`);
    }

    return obo.token;
};

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

    const url = `${SBH_API_URL}/${path.replace(/^\//, '')}`;

    const response = await fetch(url, {
        method: clientRequest.method,
        body: clientRequest.body ? JSON.stringify(clientRequest.body) : undefined,
        headers: headers,
    }).catch((error) => {
        // logger.error('Feil ved fetch fra saksbehandling-api: ', error);
        throw error;
    });

    //--------------------------------------------------------------------------------

    responseToClient.status(response.status);
    response.headers.forEach((value, key) => {
        responseToClient.setHeader(key, value);
    });
    const data = await response.arrayBuffer();
    responseToClient.send(Buffer.from(data));
}

export default withAuthenticatedApi(apiProxy);
