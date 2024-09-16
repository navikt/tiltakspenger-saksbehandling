import { logger } from '@navikt/next-logger';
import { NextApiRequest } from 'next';
import { MeldekortDTO } from '../types/MeldekortTypes';

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

export async function mutateBehandling<R>(
  url,
  { arg }: { arg: { id: string } | { begrunnelse: string } | null },
): Promise<R> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  await throwErrorIfFatal(res);
  return res.json();
}

export async function mutateMeldekort<R>(
  url,
  { arg }: { arg: MeldekortDTO },
): Promise<R> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  await throwErrorIfFatal(res);
  return res.json();
}

export async function sakFetcher<R>(
  url,
  { arg }: { arg: { fnr: string } },
): Promise<R> {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });
  await throwErrorIfFatal(res);
  return res.json();
}

export const throwErrorIfFatal = async (res: Response) => {
  if (!res.ok) {
    const error = new FetcherError('Noe gikk galt ved henting av data');

    error.info = await res.json;
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
      body: request.method === 'GET' ? undefined : request.body,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${oboToken}`,
      },
    });
  } catch (error) {
    logger.error('Fikk ikke kontakt med APIet', error);
  }
}
