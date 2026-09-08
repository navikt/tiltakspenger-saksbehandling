// Disse må importeres så tidlig som mulig for å sikre at de alltid er i scope
import '../global.css';
import '../prototypes';

import { ReactElement, ReactNode } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { useRouter } from 'next/router';
import {
    initNaisAPMClient,
    ApmErrorBoundary,
    useApmRouteTracking,
    ApmErrorBoundaryFallbackRender,
} from '@nais/apm/react';
import { InternDekoratør } from '~/lib/interndekoratør/InternDekoratør';
import { FeatureTogglesProvider } from '~/lib/_felles/context/FeatureTogglesContext';
import { SaksbehandlerProvider } from '~/lib/saksbehandler/SaksbehandlerContext';
import { ConfigProvider } from '~/lib/_felles/context/ConfigContext';
import { NotificationProvider } from '~/lib/_felles/notifications/NotificationContext';
import { NextPage } from 'next';
import { Infokort } from '~/lib/_felles/infokort/Infokort';
import { BodyShort, Box, Button, VStack } from '@navikt/ds-react';

import style from './_app.module.css';

// No-op på server og under lokal kjøring (ingen collector) – sender kun telemetri på nais
initNaisAPMClient({
    app: 'tiltakspenger-saksbehandling',
    namespace: 'tpts',
    devConsoleEcho: false,
});

type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const router = useRouter();
    useApmRouteTracking(router.asPath);

    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <>
            <Head>
                <title>{'Tiltakspenger saksbehandling'}</title>
            </Head>
            <ApmErrorBoundary fallback={ErrorFallback}>
                <ConfigProvider
                    gosysUrl={pageProps.gosysUrl}
                    modiaPersonoversiktUrl={pageProps.modiaPersonoversiktUrl}
                >
                    <FeatureTogglesProvider deployEnv={pageProps.deployEnv}>
                        <SaksbehandlerProvider initialSaksbehandler={pageProps.saksbehandler}>
                            <NotificationProvider>
                                <SWRConfig
                                    value={{
                                        shouldRetryOnError: false,
                                        revalidateOnFocus: false,
                                        revalidateOnReconnect: true,
                                    }}
                                >
                                    <InternDekoratør />
                                    <main className={style.main}>
                                        {getLayout(<Component {...pageProps} />)}
                                    </main>
                                </SWRConfig>
                            </NotificationProvider>
                        </SaksbehandlerProvider>
                    </FeatureTogglesProvider>
                </ConfigProvider>
            </ApmErrorBoundary>
        </>
    );
}

const ErrorFallback: ApmErrorBoundaryFallbackRender = (error, resetError) => (
    <Box padding={'space-32'}>
        <Infokort variant={'feil'} header={`Noe gikk galt - ${error.message}`}>
            <VStack gap={'space-8'} align={'start'}>
                <BodyShort>{'Du kan forsøke å lukke feilmeldingen og prøve på nytt.'}</BodyShort>
                <BodyShort>
                    {
                        'Hvis feilen vedvarer, kontakt utvikler-teamet med et skjermbilde av denne feilmeldingen.'
                    }
                </BodyShort>
                <code>{error.stack}</code>
                <Button onClick={resetError} size={'small'}>
                    {'Lukk'}
                </Button>
            </VStack>
        </Infokort>
    </Box>
);
