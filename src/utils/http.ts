import { SøkerIdent } from '../types/Søker';

export class FetcherError extends Error {
    info: { [key: string]: any } | undefined;
    status: number | undefined;
}

export const fetcher = async (url: string) => {
    const res = await fetch(url);
    throwErrorIfFatal(res);
    return res.json();
};

export async function fetchSøker<R>(url: string, { arg }: { arg: SøkerIdent }): Promise<R> {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });
    throwErrorIfFatal(res);
    return res.json();
}

const throwErrorIfFatal = async (res: Response) => {
    if (!res.ok && res.status >= 500) {
        const error = new FetcherError('En feil har oppstått');
        const errorMessage = await res.json();
        error.info = errorMessage.error;
        error.status = res.status;
        throw error;
    }
};
