import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@navikt/next-logger';
import { getToken, requestOboToken } from '@navikt/oasis';

const vedtakBackendUrl = process.env.TILTAKSPENGER_VEDTAK_URL || '';
const meldekortBackendUrl = process.env.TILTAKSPENGER_MELDEKORT_URL || '';
const utbetalingBackendUrl = process.env.TILTAKSPENGER_UTBETALING_URL || '';

function getUrl(req: NextApiRequest): string {
  const urlTil = req?.url;
  if (urlTil?.startsWith('/api/meldekort')) {
    const meldekortPath = req?.url?.replace('/api', '');
    return `${meldekortBackendUrl}${meldekortPath}`;
  } else if (urlTil?.startsWith('/api/utbetaling')) {
    const utbetalingPath = req?.url?.replace('/api', '');
    return `${utbetalingBackendUrl}${utbetalingPath}`;
  } else {
    const vedtakPath = req?.url?.replace('/api', '');
    return `${vedtakBackendUrl}${vedtakPath}`;
  }
}

async function makeApiRequest(
  request: NextApiRequest,
  oboToken: string,
): Promise<Response> {
  const url = getUrl(request);
  logger.info(`Making request to ${url}`);
  return await fetch(url, {
    method: request.method,
    body: request.method === 'GET' ? undefined : JSON.stringify(request.body),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${oboToken}`,
    },
  });
}

export async function middleware(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const scope = `api://${process.env.SCOPE}/.default`;
  const token = await getToken(request);
  if (token == null) {
    logger.error('Fant ikke token');
    response.status(500).json({ message: 'Bruker har ikke tilgang' });
    return;
  }

  const obo = await requestOboToken(token, scope);
  if (!obo.ok) {
    throw new Error(
      `Kunne ikke gjøre on-behalf-of-utveksling for saksbehandlertoken`,
    );
  } else {
    try {
      const res = await makeApiRequest(request, obo.token);
      if (res.ok) {
        const body = await res.json();
        response.status(res.status).json(body);
      } else {
        const error = await res.text();
        response
          .status(res.status)
          .json({ error: !error ? res.statusText : error });
      }
    } catch (error) {
      logger.error('Fikk ikke kontakt med APIet, returnerer 502', error);
      response.status(502).json({ message: 'Bad Gateway' });
    }
  }
}

export default middleware;
