import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, requestOboToken } from '@navikt/oasis';
import { makeApiRequest } from '../../../../utils/http';
import { withAuthenticatedApi } from '../../../../auth/pageWithAuthentication';
import { logger } from '@navikt/next-logger';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const token = await getToken(req);
  logger.info('Henter obo-token for tiltakspenger-meldekort-api');
  const obo = await requestOboToken(token, process.env.MELDEKORT_SCOPE);
  if (!obo.ok) {
    logger.error(
      'Kunne ikke gjøre on-behalf-of-utveksling for saksbehandlertoken',
    );
    throw new Error(
      `Kunne ikke gjøre on-behalf-of-utveksling for saksbehandlertoken`,
    );
  }

  const response = await makeApiRequest(req, obo.token);
  if (response.ok) {
    const body = await response.json();
    res.status(response.status).json(body);
  } else {
    const error = await response.text();
    res
      .status(response.status)
      .json({ error: !error ? response.statusText : error });
  }
}

export default withAuthenticatedApi(handler);
