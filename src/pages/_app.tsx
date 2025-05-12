import '../styles/global.css';

import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { InternDekoratør } from '../components/interndekoratør/InternDekoratør';
import { FeatureTogglesProvider } from '../context/feature-toggles/FeatureTogglesContext';
import { SaksbehandlerProvider } from '../context/saksbehandler/SaksbehandlerContext';
import { ConfigProvider } from '../context/ConfigContext';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Tiltakspenger saksbehandler</title>
            </Head>
            <ConfigProvider
                gosysUrl={pageProps.gosysUrl}
                modiaPersonoversiktUrl={pageProps.modiaPersonoversiktUrl}
            >
                <FeatureTogglesProvider deployEnv={pageProps.deployEnv}>
                    <SaksbehandlerProvider saksbehandler={pageProps.saksbehandler}>
                        <SWRConfig
                            value={{
                                shouldRetryOnError: false,
                                revalidateOnFocus: false,
                                revalidateOnReconnect: true,
                            }}
                        >
                            <InternDekoratør />
                            <main>
                                <Component {...pageProps} />
                            </main>
                        </SWRConfig>
                    </SaksbehandlerProvider>
                </FeatureTogglesProvider>
            </ConfigProvider>
        </>
    );
}
