import { getToken, requestOboToken, validateToken } from '@navikt/oasis';
import { logger } from '@navikt/next-logger';
import { NextRequest } from '~/utils/fetch/fetch-server';

const SBH_API_SCOPE = process.env.SAKSBEHANDLING_API_SCOPE;

const brukFakeToken =
    process.env.BRUK_LOKAL_FAKE_TOKEN === 'true' && process.env.NAIS_CLUSTER_NAME === undefined;

const hentOboTokenEkte = async (req: NextRequest) => {
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

const hentOboTokenFake = async () => 'TokenMcTokenface';

const validerTokenEkte = async (req: NextRequest) => {
    const token = getToken(req);

    if (token == null) {
        return false;
    }

    const validationResult = await validateToken(token);

    if (!validationResult.ok) {
        logger.error(
            `Ugyldig JWT token - url: ${req.url} - Error: ${validationResult.error}, ErrorType: ${validationResult.errorType}`,
        );
    }

    return validationResult.ok;
};

const validerTokenFake = async () => true;

export const hentOboToken = brukFakeToken ? hentOboTokenFake : hentOboTokenEkte;
export const validerToken = brukFakeToken ? validerTokenFake : validerTokenEkte;
