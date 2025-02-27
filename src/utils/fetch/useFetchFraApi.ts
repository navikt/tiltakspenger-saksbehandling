import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { fetchBlobFraApiClientSide, FetcherError, fetchJsonFraApiClientSide } from './fetch';

type SWRArg<BodyType> = {
    arg: BodyType;
};

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

// TODO: vurder å skrive oss vekk fra SWRMutation her. Unødvendig overhead for vårt bruk, og lite intuitiv feilhåndtering.

export const useFetchJsonFraApi = <ResponseType = unknown, BodyType = undefined>(
    url: string,
    method: Method,
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

export const useFetchBlobFraApi = <BodyType = undefined>(
    url: string,
    method: Method,
    swrOptions?: SWRMutationConfiguration<Blob | undefined, FetcherError, string, BodyType>,
) => {
    const fetcher = async (_url: string, { arg }: SWRArg<BodyType>) =>
        fetchBlobFraApiClientSide(_url, {
            method,
            body: arg ? JSON.stringify(arg) : undefined,
        });

    return useSWRMutation<Blob | undefined, FetcherError, string, BodyType>(url, fetcher, {
        throwOnError: false,
        ...swrOptions,
    });
};
