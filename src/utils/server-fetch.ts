import { getToken, requestOboToken } from '@navikt/oasis';
import { logger } from '@navikt/next-logger';
import { IncomingMessage } from 'node:http';
import { NextApiRequest } from 'next';
import { SakProps, SakId } from '../types/SakTypes';
import { throwErrorIfFatal } from './client-fetch';
import { MeldeperiodeKjedeId, MeldeperiodeKjedeProps } from '../types/meldekort/Meldeperiode';

type NextRequest = Request | IncomingMessage | NextApiRequest;

const SBH_API_URL = process.env.TILTAKSPENGER_SAKSBEHANDLING_API_URL;
const SBH_API_SCOPE = process.env.SAKSBEHANDLING_API_SCOPE;

const hentOboToken = async (req: NextRequest) => {
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

export const fetchFraApi = async (req: NextRequest, path: string, options?: RequestInit) => {
    const oboToken = await hentOboToken(req);

    const url = `${SBH_API_URL}/${path.replace(/^\//, '')}`;

    return fetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            authorization: `Bearer ${oboToken}`,
        },
    }).catch((error) => {
        logger.error('Feil ved fetch fra saksbehandling-api: ', error);
        throw error;
    });
};

export const fetchJsonFraApi = async <JsonResponse>(
    req: NextRequest,
    path: string,
    options?: RequestInit,
): Promise<JsonResponse> => {
    return fetchFraApi(req, path, options).then((res) => {
        throwErrorIfFatal(res);
        return res.json() as JsonResponse;
    });
};

export const fetchSak = async (req: NextRequest, saksnummer: string) =>
    fetchJsonFraApi<SakProps>(req, `/sak/${saksnummer}`);

export const fetchMeldeperiodeKjede = async (
    req: NextRequest,
    sakId: SakId,
    meldeperiodeKjedeId: MeldeperiodeKjedeId,
) =>
    fetchJsonFraApi<MeldeperiodeKjedeProps>(
        req,
        `/sak/${sakId}/meldeperiode/${encodeURIComponent(meldeperiodeKjedeId)}`,
    );
