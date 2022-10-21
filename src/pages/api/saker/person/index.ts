import { NextApiRequest, NextApiResponse } from 'next';

const backendUrl = 'https://tiltakspenger-vedtak.dev.intern.nav.no';

const url = (tenant: string) => `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
const tenant = '966ac572-f5b7-4bbe-aa88-c76419c0f851';
const scope = 'api://eafda703-c821-44de-990c-950dec1ad22f/.default';

const clientId = process.env.AZURE_APP_CLIENT_ID;
const clientSecret = process.env.AZURE_APP_CLIENT_SECRET;

const toBody = (token: string) => ({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    client_id: clientId,
    client_secret: clientSecret,
    assertion: token,
    scope: scope,
    requested_token_use: 'on_behalf_of',
});

interface TokenResponse {
    access_token: string;
}

export const getBody = (res: Response): Promise<Record<string, unknown>> => {
    const contentType = res.headers.get('content-type');
    if (contentType?.startsWith('application/json')) {
        return res.json() as Promise<Record<string, unknown>>;
    }
    throw Error('Unknown content-type');
};

const onBehalfOfGrant = async (token: string) => {
    const body = new URLSearchParams();
    const rawBody = toBody(token);
    Object.entries(rawBody).map(([key, entry]) => {
        body.append(key, entry || '');
    });

    console.info(`Making call to ${url(tenant)}`);
    const res = await fetch(url(tenant), {
        method: 'POST',
        body,
        headers: {
            ['Content-Type']: 'application/x-www-form-urlencoded',
        },
    });

    const resBody = await getBody(res);
    if (!res.ok) {
        console.info(`Call to ${url(tenant)} is not ok`);
        console.error(`Error: ${resBody}`);
        return Promise.reject({
            status: res.status,
            content: res.headers.get('content-type'),
            body: resBody,
        });
    }

    return (resBody as unknown as TokenResponse).access_token;
};

const Authorization = 'authorization';
const tokenRegex = /^Bearer (?<token>(\.?([A-Za-z0-9-_]+)){3})$/m;

const buildApiUrl = (pathname: string) => {
    const pathnameWithoutPrefix = pathname.replace('/api', '');
    return `${backendUrl}${pathnameWithoutPrefix}`;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        const { authorization } = request.headers;
        if (!authorization) {
            console.error('Missing authorization header on request');
            response.status(401).json({ error: 'Ingen tilgang' });
            throw new Error();
        }
        const authToken = authorization.match(tokenRegex)?.groups?.token;
        if (!authToken) {
            console.error('Invalid authorization header');
            response.status(401).json({ error: 'Ingen tilgang' });
            throw new Error();
        }

        const onBehalfOfToken = await onBehalfOfGrant(authToken);
        console.info('Acquired on behalf of token');
        const fullUrl = buildApiUrl('/saker/person');
        console.info(`Making request to ${fullUrl}`);
        const { status, body } = await fetch(fullUrl, {
            method: request.method,
            body: request.method === 'GET' ? undefined : request.body,
            headers: {
                'content-type': 'application/json',
                [Authorization]: `Bearer ${onBehalfOfToken}`,
            },
        });

        if (status !== 200) {
            response.status(status).json({ error: body });
        } else {
            response.status(status).json(body);
        }
    } catch (error) {
        console.error('Something went wrong during authorization');
    }
}
