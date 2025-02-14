import { getToken, requestOboToken } from '@navikt/oasis';
import { logger } from '@navikt/next-logger';
import { IncomingMessage } from 'node:http';
import { NextApiRequest } from 'next';

type NextRequest = Request | IncomingMessage | NextApiRequest;

export const hentOboToken = async (req: NextRequest) => {
    const token = await getToken(req);
    if (!token) {
        throw new Error(`Kunne ikke hente token!`);
    }

    logger.info('Henter obo-token for tiltakspenger-saksbehandling-api');

    const obo = await requestOboToken(token, `${process.env.SAKSBEHANDLING_API_SCOPE}`);
    if (!obo.ok) {
        throw new Error(`Kunne ikke gjøre on-behalf-of-utveksling for saksbehandlertoken`);
    }

    return obo.token;
};
