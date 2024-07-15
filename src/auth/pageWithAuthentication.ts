import { getToken, validateToken } from '@navikt/oasis';
import {
  GetServerSidePropsContext,
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { logger } from '@navikt/next-logger';
import { IncomingHttpHeaders } from 'http';
import { TokenPayload } from '../types/Auth';

/**
 * Inspirert av løsningen til sykepenger: https://github.com/navikt/sykmeldinger/pull/548/files
 */

export const defaultGetServerSideProps = async () => ({ props: {} });
type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<unknown> | unknown;

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
          destination: `/oauth2/login?redirect=${context.resolvedUrl}`,
          permanent: false,
        },
      };
    }

    const validationResult = await validateToken(token);
    if (!validationResult.ok) {
      const error = new Error(
        `Ugyldig JWT token funnet omdirigerer til innlogging.`,
      );

      logger.error(error);

      return {
        redirect: {
          destination: `/oauth2/login?redirect=${context.resolvedUrl}`,
          permanent: false,
        },
      };
    }
    return getServerSideProps(context);
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

/**
 * Lager HTTP context som sendes gjennom resolver og servicer, både for prefetching og HTTP-fetching.
 */
export function createRequestContext(
  requestId: string | undefined,
  token: string | undefined,
) {
  if (!token) {
    logger.warn('User is missing authorization bearer token');
    return null;
  }
  const accessToken = token.replace('Bearer ', '');
  const jwtPayload = accessToken.split('.')[1];
  return {
    accessToken,
    payload: JSON.parse(Buffer.from(jwtPayload, 'base64').toString()),
    requestId: requestId ?? 'not set',
    sessionId: 'unused',
  };
}

export function parseAuthHeader(
  headers: IncomingHttpHeaders,
): TokenPayload | null {
  if (!headers.authorization) return null;
  const accessToken = headers.authorization.replace('Bearer ', '');
  const jwtPayload = accessToken.split('.')[1];
  return JSON.parse(Buffer.from(jwtPayload, 'base64').toString());
}
