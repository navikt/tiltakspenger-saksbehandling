import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from '../../../../utils/auth';

const backendUrl = process.env.TILTAKSPENGER_VEDTAK_URL;

const buildApiUrl = (pathname: string) => {
    const pathnameWithoutPrefix = pathname.replace('/api', '');
    return `${backendUrl}${pathnameWithoutPrefix}`;
};

function getSøknader(onBehalfOfToken: string, body: string) {
    const personUrl = buildApiUrl('/person/søknader');
    return fetch(personUrl, {
        method: 'POST',
        body: body,
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${onBehalfOfToken}`,
        },
    });
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        const onBehalfOfToken = await getToken(request);
        const apiResponse = await getSøknader(onBehalfOfToken, request.body);

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
        response.status(401).json({ error: 'Unauthorized' });
    }
}
