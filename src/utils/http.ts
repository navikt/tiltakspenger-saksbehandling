export const fetcher = (input: RequestInfo | URL, init?: RequestInit) => fetch(input, init).then((res) => res.json());

export async function fetchSøker(personId: string): Promise<Response> {
    return await fetch('/api/soker', {
        method: 'post',
        body: JSON.stringify({
            ident: personId,
        }),
    });
}
