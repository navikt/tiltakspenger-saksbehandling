import { getToken, validateToken } from '@navikt/oasis';
import {
    GetServerSidePropsContext,
    GetServerSideProps,
    NextApiRequest,
    NextApiResponse,
} from 'next';
import { logger } from '@navikt/next-logger';
import { fetchFraApi } from '../utils/server-fetch';
import { Saksbehandler } from '../types/Saksbehandler';

const LOGIN_API_URL = `${process.env.WONDERWALL_ORIGIN || ''}/oauth2/login`;

/**
 * Inspirert av løsningen til sykepenger: https://github.com/navikt/sykmeldinger/pull/548/files
 */

const defaultProps = { deployEnv: process.env.NAIS_CLUSTER_NAME ?? null };
const defaultGetServerSideProps: GetServerSideProps = async () => ({ props: defaultProps });
type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<unknown> | unknown;

/**
 * Brukes for å autentisere Next.JS pages. Forutsetter at applikasjonen ligger bak
 * Wonderwall (https://doc.nais.io/security/auth/idporten/sidecar/). Vil automatisk omdirigere til innlogging dersom
 * Wonderwall-cookie mangler.
 */

export function pageWithAuthentication(
    getServerSideProps: GetServerSideProps = defaultGetServerSideProps,
) {
    return async (context: GetServerSidePropsContext) => {
        const token = getToken(context.req);

        if (token == null) {
            return {
                redirect: {
                    destination: `${LOGIN_API_URL}?redirect=${context.resolvedUrl}`,
                    permanent: false,
                },
            };
        }

        const validationResult = await validateToken(token);
        if (!validationResult.ok) {
            const error = new Error(
                `Ugyldig JWT token funnet omdirigerer til innlogging. Error: ${validationResult.error}, ErrorType: ${validationResult.errorType}`,
            );

            logger.error(error);

            return {
                redirect: {
                    destination: `${LOGIN_API_URL}?redirect=${context.resolvedUrl}`,
                    permanent: false,
                },
            };
        }

        const saksbehandler = await fetchFraApi(context.req, '/saksbehandler')
            .then((res) => (res.ok ? (res.json() as Promise<Saksbehandler>) : null))
            .catch((e) => {
                logger.error(`Feil under henting av saksbehandler - ${e}`);
                return null;
            });

        return getServerSideProps(context).then((result) => {
            const props = (result as any).props;
            return {
                ...result,
                props: props ? { ...defaultProps, ...props, saksbehandler } : undefined,
            };
        });
    };
}

/**
 * Brukes for å autentisere api requests. Forutsetter at applikasjonen ligger bak
 * Wonderwall (https://doc.nais.io/security/auth/idporten/sidecar/).
 */
export function withAuthenticatedApi(handler: ApiHandler): ApiHandler {
    return async function withBearerTokenHandler(req, res, ...rest) {
        const token = getToken(req);
        if (token == null) {
            res.status(401).json({ message: 'Ingen tilgang' });
            return;
        }

        const validatedToken = await validateToken(token);
        if (!validatedToken.ok) {
            logger.error(`Ugyldig JWT token funnet for API ${req.url}`);

            res.status(401).json({ message: 'Ingen tilgang' });
            return;
        }

        return handler(req, res, ...rest);
    };
}
