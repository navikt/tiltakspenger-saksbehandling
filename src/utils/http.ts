import { SøkerIdent, SøkerResponse } from '../types/Søker';

// export const fetcher = (input: RequestInfo | URL, init?: RequestInit) => fetch(input, init).then((res) => res.json());

export class FetcherError extends Error {
    info: { [key: string]: any } | undefined;
    status: number | undefined;
}

export const fetcher = async (url: string) => {
    const res = await fetch(url);

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
        const error = new FetcherError('En feil har oppstått');
        // Attach extra info to the error object.
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }

    return res.json();
};

export async function fetchSøker<R>(url: string, { arg }: { arg: SøkerIdent }): Promise<R> {
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    });

    if (!res.ok) {
        const error = new FetcherError('En feil har oppstått');
        // Attach extra info to the error object.
        const errorMessage = await res.json();
        error.info = errorMessage.error;
        error.status = res.status;
        throw error;
    }

    console.log('res', res);

    return res.json();
}
