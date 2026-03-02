import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { fetchBlobFraApiClientSide, FetcherError, fetchJsonFraApiClientSide } from './fetch';

type SWRArg<BodyType> = {
    arg: BodyType;
};

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export const useFetchJsonFraApi = <
    ResponseType = unknown,
    BodyType = undefined,
    ErrorBody extends FetcherError = FetcherError,
>(
    url: string,
    method: Method,
    swrOptions?: SWRMutationConfiguration<ResponseType, ErrorBody, string, BodyType> & {
        throwOnError?: boolean;
    },
) => {
    const fetcher = async (_url: string, { arg }: SWRArg<BodyType>) =>
        fetchJsonFraApiClientSide<ResponseType>(_url, {
            method,
            body: arg ? JSON.stringify(arg) : undefined,
        });

    return useSWRMutation<ResponseType, ErrorBody, string, BodyType>(url, fetcher, {
        throwOnError: false,
        ...swrOptions,
    });
};

export const useFetchBlobFraApi = <BodyType = undefined>(
    url: string,
    method: Method,
    swrOptions?: SWRMutationConfiguration<Blob, FetcherError, string, BodyType>,
) => {
    const fetcher = async (_url: string, { arg }: SWRArg<BodyType>) =>
        fetchBlobFraApiClientSide(_url, {
            method,
            body: arg ? JSON.stringify(arg) : undefined,
        });

    return useSWRMutation<Blob, FetcherError, string, BodyType>(url, fetcher, {
        throwOnError: false,
        ...swrOptions,
    });
};
