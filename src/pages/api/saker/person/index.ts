import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken, validateAuthorizationHeader } from '../../../../utils/auth';

const backendUrl = 'https://tiltakspenger-vedtak.dev.intern.nav.no';

const scope = 'api://eafda703-c821-44de-990c-950dec1ad22f/.default';

const clientId = process.env.AZURE_APP_CLIENT_ID || '';
const clientSecret = process.env.AZURE_APP_CLIENT_SECRET || '';

const Authorization = 'authorization';

const buildApiUrl = (pathname: string) => {
    const pathnameWithoutPrefix = pathname.replace('/api', '');
    return `${backendUrl}${pathnameWithoutPrefix}`;
};

function getPerson(onBehalfOfToken: string) {
    const personUrl = buildApiUrl('/saker/person');
    return fetch(personUrl, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            [Authorization]: `Bearer ${onBehalfOfToken}`,
        },
    });
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        const authToken = await validateAuthorizationHeader(request);
        const onBehalfOfToken = await getAccessToken(clientId, clientSecret, authToken, scope);
        const apiResponse = await getPerson(onBehalfOfToken);

        if (apiResponse.status !== 200) {
            const errorMessage = await apiResponse.text();
            response.status(apiResponse.status).json({ error: errorMessage });
        } else {
            try {
                const jsonResponse = await apiResponse.json();
                response.status(apiResponse.status).json(jsonResponse);
            } catch (error) {
                console.error('Error processing json response');
                response.status(500).json({ error: 'Internal server error' });
            }
        }
    } catch (error) {
        console.error('Something went wrong during authorization', error);
    }
}
