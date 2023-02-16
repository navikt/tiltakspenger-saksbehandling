import '@navikt/ds-css';
import '@navikt/ds-css-internal';
import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../components/error-fallback/error-fallback';
import { PageLayout } from '../layouts/page/PageLayout';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Tiltakspenger saksbehandler</title>
            </Head>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <PageLayout>
                    <Component {...pageProps} />
                </PageLayout>
            </ErrorBoundary>
        </>
    );
}
