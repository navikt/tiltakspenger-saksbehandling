import { getToken, SimpleResponse } from '../../utils/auth';
import { NextApiRequest, NextApiResponse } from 'next';

const Authorization = 'authorization';
const backendUrl = "http://localhost:8080/";

const getUrl = async (req: NextApiRequest): Promise<string> => {
    const apiUrl = backendUrl;
    const path = req?.url?.replace('/api', '');
    return apiUrl + path;
};

export async function middleware(
    req: NextApiRequest,
    response: NextApiResponse
): Promise<void> {
    let oboToken = null
    try {
        oboToken = await getToken(req);
    } catch (err: any) {
        const simpleResponse = err as SimpleResponse
        console.log('Bruker har ikke tilgang, kall mot Azure feilet', simpleResponse.body);
        response.status(simpleResponse.status).json({ message: 'Bruker har ikke tilgang' });
    }
    if( oboToken ) {
        try {
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
}

export default middleware;
