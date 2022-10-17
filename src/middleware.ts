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

    const res = await fetch(url(tenant), {
        method: 'POST',
        body,
        headers: {
            ['Content-Type']: 'application/x-www-form-urlencoded',
        },
    });

    const resBody = await getBody(res);

    if (!res.ok) {
        return Promise.reject({
            status: res.status,
            content: res.headers.get('content-type'),
            body: resBody,
        });
    }

    return (resBody as unknown as TokenResponse).access_token;
};

export const exchangeToken = async (token: string) => {
    const oboToken = await onBehalfOfGrant(token);
    return oboToken;
};

const Authorization = 'authorization';
const tokenRegex = /^Bearer (?<token>(\.?([A-Za-z0-9-_]+)){3})$/m;

const extractToken = (req: NextApiRequest) => {
    const authHeader = req.headers[Authorization];
    if (!authHeader) throw new Error('No authorization header was found');
    const token = authHeader.match(tokenRegex)?.groups?.token;
    if (!token) throw new Error('Invalid authorization header');
    return token;
};

export async function middleware(request: NextApiRequest, response: NextApiResponse) {
    try {
        const authToken = extractToken(request);
        const onBehalfOfToken = exchangeToken(authToken);
        const res = await fetch(request.url || backendUrl, {
            method: request.method,
            body: request.method === 'GET' ? undefined : request.body,
            headers: {
                'content-type': 'application/json',
                [Authorization]: `Bearer ${onBehalfOfToken}`,
            },
        });
        const body = await (res.status === 200 ? res.json() : res.text());
        response.status(res.status).json(body);
    } catch (err) {
        if (response.status) {
            response.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default middleware;
