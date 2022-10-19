import { NextRequest, NextResponse } from 'next/server';

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

const buildApiUrl = (pathname: string) => {
    const pathnameWithoutPrefix = pathname.replace('/api', '');
    return `${backendUrl}${pathnameWithoutPrefix}`;
};

export async function middleware(request: NextRequest, response: NextResponse) {
    try {
        const authorization = request.headers.get(Authorization);
        if (!authorization) {
            console.error('Missing authorization header on request');
            throw new Error();
        }
        const authToken = authorization.match(tokenRegex)?.groups?.token;
        if (!authToken) {
            console.error('Invalid authorization header');
            throw new Error();
        }

        const onBehalfOfToken = exchangeToken(authToken);
        console.info('Acquired on behalf of token');
        const fullUrl = buildApiUrl(request.nextUrl.pathname);
        const res = await fetch(fullUrl, {
            method: request.method,
            body: request.method === 'GET' ? undefined : request.body,
            headers: {
                'content-type': 'application/json',
                [Authorization]: `Bearer ${onBehalfOfToken}`,
            },
        });
        console.info('Got a response with status', res.status);
        const status = response.status;
        if (status === 200) {
            return response.json();
        }
        return response.text();
    } catch (error) {
        console.error('Something went wrong during authorization');
    }
}

export const config = {
    matcher: '/api/:path*',
};

export default middleware;
