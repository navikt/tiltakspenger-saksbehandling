import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, requestOboToken } from '@navikt/oasis';
import { logger } from '@navikt/next-logger';
import { withAuthenticatedApi } from '../../auth/pageWithAuthentication';
import { makeApiRequest } from '../../utils/http';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const token = await getToken(req);
  logger.info('Henter obo-token for tiltakspenger-vedtak');
  const obo = await requestOboToken(
    token,
    `api://${process.env.VEDTAK_SCOPE}/.default`,
  );
  if (!obo.ok) {
    throw new Error(
      `Kunne ikke gjøre on-behalf-of-utveksling for saksbehandlertoken`,
    );
  }

  try {
    const response = await makeApiRequest(req, obo.token);
    const body = await response.json();
    res.status(response.status).json(body);
  } catch (err) {
    res.status(err.status).json(err.info);
  }
}

export default withAuthenticatedApi(handler);
