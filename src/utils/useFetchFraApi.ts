import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { FetcherError, fetchJsonFraApiClientSide } from './fetch';

type SWRArg<BodyType> = {
    arg: BodyType;
};

// TODO: vurder å skrive oss vekk fra SWRMutation her. Unødvendig overhead for vårt bruk, og lite intuitiv feilhåndtering.

export const useFetchFraApi = <ResponseType = unknown, BodyType = undefined>(
    url: string,
    method: 'GET' | 'POST' | 'PATCH',
    swrOptions?: SWRMutationConfiguration<ResponseType | undefined, FetcherError, string, BodyType>,
) => {
    const fetcher = async (_url: string, { arg }: SWRArg<BodyType>) =>
        fetchJsonFraApiClientSide<ResponseType | undefined>(_url, {
            method,
            body: arg ? JSON.stringify(arg) : undefined,
        });

    return useSWRMutation<ResponseType | undefined, FetcherError, string, BodyType>(url, fetcher, {
        throwOnError: false,
        ...swrOptions,
    });
};
