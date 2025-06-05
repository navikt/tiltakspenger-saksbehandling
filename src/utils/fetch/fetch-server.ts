import { getToken, requestOboToken } from '@navikt/oasis';
import { logger } from '@navikt/next-logger';
import { IncomingMessage } from 'node:http';
import { NextApiRequest } from 'next';
import { SakProps } from '../../types/SakTypes';
import { BehandlingData, BehandlingId } from '../../types/BehandlingTypes';
import { Saksbehandler } from '../../types/Saksbehandler';
import { stripLeadingSlash } from '../string';
import { errorFraApiResponse } from './fetch';
import { Behandlingssammendrag } from '../../types/Behandlingssammendrag';

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

const methodsWithBody: ReadonlySet<string> = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const hentBody = (options?: RequestInit) => {
    if (!options?.body) {
        return undefined;
    }
    const { method = 'GET', body } = options;
    return methodsWithBody.has(method) ? body : undefined;
};

export const fetchFraApiServerSide = async (
    req: NextRequest,
    path: string,
    options?: RequestInit,
) => {
    const oboToken = await hentOboToken(req);

    const url = `${SBH_API_URL}/${stripLeadingSlash(path)}`;

    return fetch(url, {
        ...options,
        body: hentBody(options),
        headers: {
            ...options?.headers,
            authorization: `Bearer ${oboToken}`,
        },
    }).catch((error) => {
        logger.error('Feil ved fetch fra saksbehandling-api: ', error);
        throw error;
    });
};

const fetchJsonFraApi = async <JsonResponse>(
    req: NextRequest,
    path: string,
    options?: RequestInit,
): Promise<JsonResponse> => {
    return fetchFraApiServerSide(req, path, options).then(async (res) => {
        if (res.ok) {
            return res.json() as JsonResponse;
        }
        throw await errorFraApiResponse(res);
    });
};

export const fetchSak = async (req: NextRequest, saksnummer: string) =>
    fetchJsonFraApi<SakProps>(req, `/sak/${saksnummer}`);

export const fetchBenkOversikt = async (req: NextRequest) =>
    fetchJsonFraApi<{
        behandlingssammendrag: Behandlingssammendrag[];
        totalAntall: number;
    }>(req, '/behandlinger', {
        body: JSON.stringify({
            behandlingstype: null,
            status: null,
            sortering: 'ASC',
        }),
        method: 'POST',
    });

export const fetchSaksbehandler = async (req: NextRequest) =>
    fetchJsonFraApi<Saksbehandler>(req, '/saksbehandler');

export const fetchBehandling = async (req: NextRequest, behandlingId: BehandlingId) =>
    fetchJsonFraApi<BehandlingData>(req, `/behandling/${behandlingId}`);
