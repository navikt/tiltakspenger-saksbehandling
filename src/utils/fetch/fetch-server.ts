import { logger } from '@navikt/next-logger';
import { IncomingMessage } from 'node:http';
import { NextApiRequest } from 'next';
import { SakProps } from '~/lib/sak/SakTyper';
import { stripLeadingSlash } from '../string';
import { errorFraApiResponse } from './fetch';
import { hentOboToken } from '~/auth/tokens';
import { BenkOversiktRequestBody, BenkOversiktProps } from '~/lib/benk/typer/Benk';
import { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';

export type NextRequest = Request | IncomingMessage | NextApiRequest;

const SBH_API_URL = process.env.TILTAKSPENGER_SAKSBEHANDLING_API_URL;

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

export const fetchJsonFraApiServerSide = async <JsonResponse>(
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
    fetchJsonFraApiServerSide<SakProps>(req, `/sak/${saksnummer}`);

export const fetchBenkOversikt = async (req: NextRequest, body: BenkOversiktRequestBody) =>
    fetchJsonFraApiServerSide<BenkOversiktProps>(req, '/behandlinger', {
        body: JSON.stringify(body),
        method: 'POST',
    });

export const fetchSaksbehandler = async (req: NextRequest) =>
    fetchJsonFraApiServerSide<Saksbehandler>(req, '/saksbehandler');
