import { NextApiRequest } from 'next';

function getFieldsForOnBehalfOfGrant(clientId: string, clientSecret: string, token: string, scope: string) {
    return {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        client_id: clientId,
        client_secret: clientSecret,
        assertion: token,
        scope: scope,
        requested_token_use: 'on_behalf_of',
    };
}

function createOnBehalfOfGrantBody(clientId: string, clientSecret: string, token: string, scope: string) {
    const oboGrantFields = getFieldsForOnBehalfOfGrant(clientId, clientSecret, token, scope);
    const body = new URLSearchParams();
    Object.entries(oboGrantFields).map(([fieldName, fieldValue = '']) => {
        body.append(fieldName, fieldValue);
    });
    return body;
}

const createOnBehalfOfGrantUrl = (tenantId: string) =>
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

async function makeOnBehalfOfGrant(body: URLSearchParams) {
    const url = createOnBehalfOfGrantUrl('966ac572-f5b7-4bbe-aa88-c76419c0f851');
    return fetch(url, {
        method: 'POST',
        body,
        headers: {
            ['Content-Type']: 'application/x-www-form-urlencoded',
        },
    });
}

export async function getAccessToken(clientId: string, clientSecret: string, token: string, scope: string) {
    const grantBody = createOnBehalfOfGrantBody(clientId, clientSecret, token, scope);
    const response = await makeOnBehalfOfGrant(grantBody);
    if (!response.ok) {
        return Promise.reject({
            status: response.status,
            content: response.headers.get('content-type'),
            body: response.body,
        });
    }
    const jsonResponse = await response.json();
    return jsonResponse.access_token;
}

const tokenRegex = /^Bearer (?<token>(\.?([A-Za-z0-9-_]+)){3})$/m;

export async function validateAuthorizationHeader(request: NextApiRequest) {
    const { authorization } = request.headers;
    if (!authorization) {
        throw new Error('Ingen tilgang');
    }
    const authToken = authorization.match(tokenRegex)?.groups?.token;
    if (!authToken) {
        throw new Error('Ingen tilgang');
    }
    return authToken;
}
