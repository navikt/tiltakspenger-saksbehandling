import '@navikt/ds-css';
import '@navikt/ds-css-internal';
import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { PageLayout } from '../layouts/page/PageLayout';
import CustomToaster from '../components/toaster/Toaster';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Tiltakspenger saksbehandler</title>
            </Head>
            <PageLayout>
                <Component {...pageProps} />
            </PageLayout>
            <CustomToaster />
        </>
    );
}
