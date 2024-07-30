import { logger } from '@navikt/next-logger';
import { NextApiRequest } from 'next';
import { SøkerIdent } from '../types/Søker';

const vedtakBackendUrl = process.env.TILTAKSPENGER_VEDTAK_URL || '';
const meldekortBackendUrl = process.env.TILTAKSPENGER_MELDEKORT_URL || '';
const utbetalingBackendUrl = process.env.TILTAKSPENGER_UTBETALING_URL || '';

export class FetcherError extends Error {
  info: { [key: string]: any } | undefined;
  status: number | undefined;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  await throwErrorIfFatal(res);
  return res.json();
};

export async function mutateBehandling(url, { arg }: { arg: string }) {
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ id: arg }),
  });
}

export async function fetchSøker<R>(
  url: string,
  { arg }: { arg: SøkerIdent },
): Promise<R> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  await throwErrorIfFatal(res);
  return res.json();
}

const throwErrorIfFatal = async (res: Response) => {
  if (!res.ok) {
    const error = new FetcherError('En feil har oppstått');
    const errorMessage = await res.json();
    error.info = errorMessage.error;
    error.status = res.status;
    throw error;
  }
};
function getUrl(req: NextApiRequest): string {
  const urlTil = req.url;
  if (urlTil.startsWith('/api/meldekort')) {
    const meldekortPath = req.url.replace('/api', '');
    return `${meldekortBackendUrl}${meldekortPath}`;
  } else if (urlTil.startsWith('/api/utbetaling')) {
    const utbetalingPath = req.url.replace('/api', '');
    return `${utbetalingBackendUrl}${utbetalingPath}`;
  } else {
    const vedtakPath = req.url.replace('/api', '');
    return `${vedtakBackendUrl}${vedtakPath}`;
  }
}

export async function makeApiRequest(
  request: NextApiRequest,
  oboToken: string,
): Promise<Response> {
  const url = getUrl(request);
  logger.info(`Sender request til ${url}`);
  try {
    return await fetch(url, {
      method: request.method,
      body: request.method === 'GET' ? undefined : JSON.stringify(request.body),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${oboToken}`,
      },
    });
  } catch (error) {
    logger.error('Fikk ikke kontakt med APIet', error);
  }
}
