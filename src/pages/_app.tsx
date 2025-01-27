import '@navikt/ds-css';

import React, { ReactElement, ReactNode } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { HovedLayout } from '../components/layout/HovedLayout';
import { NextPage } from 'next';
import { SWRConfig } from 'swr';
import { FeatureTogglesProvider } from '../context/feature-toggles/FeatureTogglesProvider';
import { SaksbehandlerProvider } from '../context/saksbehandler/SaksbehandlerProvider';

// Dette trenger vi for å løse nøstede layouts så alle sidene får
// personalia header og tabsene uten å måtte rendre de på nytt.
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <>
            <Head>
                <title>Tiltakspenger saksbehandler</title>
            </Head>
            <FeatureTogglesProvider deployEnv={pageProps.deployEnv}>
                <SaksbehandlerProvider>
                    <SWRConfig
                        value={{
                            shouldRetryOnError: false,
                            revalidateOnFocus: false,
                            revalidateOnReconnect: true,
                        }}
                    >
                        <HovedLayout>{getLayout(<Component {...pageProps} />)}</HovedLayout>
                    </SWRConfig>
                </SaksbehandlerProvider>
            </FeatureTogglesProvider>
        </>
    );
}
