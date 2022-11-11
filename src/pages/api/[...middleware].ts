import { getOnBehalfOfToken } from '../../utils/auth';
import { NextApiRequest, NextApiResponse } from 'next';

const Authorization = 'authorization';
const backendUrl = "http://localhost:8080/";
const tokenRegex = /^Bearer (?<token>(\.?([A-Za-z0-9-_]+)){3})$/m;

const extractToken = (req: NextApiRequest) => {
    const authHeader = req.headers[Authorization]
    if (!authHeader) throw new Error('No authorization header was found');
    const token = authHeader.match(tokenRegex)?.groups?.token
    if (!token) throw new Error('Invalid authorization header');
    return token;
};

const getUrl = async (req: NextApiRequest): Promise<string> => {
    const apiUrl = backendUrl;
    const path = req?.url?.replace('/api', '');
    return apiUrl + path;
};

export async function middleware(
    req: NextApiRequest,
    response: NextApiResponse
): Promise<void> {
    try {
        const oboToken = await getOnBehalfOfToken(extractToken(req), 'tiltakspenger-vedtak');
        const url = await getUrl(req);
        const res = await fetch(url, {
            method: req.method,
            body: req.method === 'GET' ? undefined : req.body,
            headers: {
                'content-type': 'application/json',
                [Authorization]: `Bearer ${oboToken}`,
            },
        });
        const body = await (res.status === 200 ? res.json() : res.text());
        response.status(res.status).json(body);
    } catch (err) {
        console.error('Her kommer det en feil');
        console.error(err);
        console.error( {err});
        console.error("Error: ", err);
        response.status(500).json({ message: 'Internal server error' });
    }
}

export default middleware;
