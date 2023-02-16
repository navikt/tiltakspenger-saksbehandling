import '@navikt/ds-css';
import '@navikt/ds-css-internal';
import React from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Header from '../components/header/Header';
import { fetcher, fetchSøker } from '../utils/http';
import { Saksbehandler } from '../types/Saksbehandler';
import useSWRMutation from 'swr/mutation';
import Head from 'next/head';
import { ErrorBoundary } from 'react-error-boundary';
import { SøkerResponse } from '../types/Søker';
import ErrorFallback from '../components/error-fallback/error-fallback';

export default function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    const { data: saksbehandler, error } = useSWR<Saksbehandler>('/api/saksbehandler', fetcher);

    const { trigger, isMutating } = useSWRMutation<SøkerResponse>('/api/soker', fetchSøker, {
        onSuccess: (data) => router.push(`/soker/${data.id}`),
    });

    return (
        <React.Fragment>
            <Head>
                <title>Tiltakspenger saksbehandler</title>
            </Head>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Header
                    isSearchLoading={isMutating}
                    onSearch={(searchString) => trigger({ ident: searchString })}
                    saksbehandler={saksbehandler}
                />
                <Component {...pageProps} />
            </ErrorBoundary>
        </React.Fragment>
    );
}
