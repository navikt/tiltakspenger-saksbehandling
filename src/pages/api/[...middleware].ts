import { getToken } from '../../utils/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import SimpleResponse from '../../types/SimpleResponse';

const backendUrl = process.env.TILTAKSPENGER_VEDTAK_URL || '';

function getUrl(req: NextApiRequest): string {
    const path = req?.url?.replace('/api', '');
    return `${backendUrl}${path}`;
}

async function makeApiRequest(request: NextApiRequest, oboToken: string): Promise<Response> {
    const url = getUrl(request);
    console.info(`Making request to ${url}`);
    return await fetch(url, {
        method: request.method,
        body: request.method === 'GET' ? undefined : request.body,
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${oboToken}`,
        },
    });
}

export async function middleware(request: NextApiRequest, response: NextApiResponse): Promise<void> {
    let oboToken = null;
    try {
        oboToken = await getToken(request);
    } catch (err: any) {
        const simpleResponse = err as SimpleResponse;
        console.log('Bruker har ikke tilgang, kall mot Azure feilet');
        response.status(simpleResponse.status).json({ message: 'Bruker har ikke tilgang' });
    }
    if (oboToken) {
        try {
            const res = await makeApiRequest(request, oboToken as string);
            const body = await (res.status === 200 ? res.json() : res.text());
            response.status(res.status).json(body);
        } catch (err) {
            console.error('Fikk ikke kontakt med APIet');
            response.status(502).json({ message: 'Bad Gateway' });
        }
    }
}

export default middleware;
