import { SøkerIdent, SøkerResponse } from '../types/Søker';

export const fetcher = (input: RequestInfo | URL, init?: RequestInit) => fetch(input, init).then((res) => res.json());

export async function fetchSøker<R>(url: string, { arg }: { arg: SøkerIdent }): Promise<R> {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(arg),
    }).then((res) => res.json());
}
