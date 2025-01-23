import '@navikt/ds-css';
import React, {
    Dispatch,
    useState,
    SetStateAction,
    useEffect,
    ReactElement,
    ReactNode,
} from 'react';
import { AppProps } from 'next/app';
import { createContext } from 'react';
import Head from 'next/head';
import { Saksbehandler } from '../types/Saksbehandler';
import useSaksbehandler from '../hooks/useSaksbehandler';
import { HovedLayout } from '../components/layout/HovedLayout';
import { Loader } from '@navikt/ds-react';
import { NextPage } from 'next';
import { SWRConfig } from 'swr';
import { FeatureTogglesProvider } from '../context/feature-toggles/FeatureTogglesProvider';

interface SaksbehandlerContextType {
    innloggetSaksbehandler: Saksbehandler;
    setInnloggetSaksbehandler: Dispatch<SetStateAction<undefined | Saksbehandler>>;
}
// Dette trenger vi for å løse nøstede layouts så alle sidene får
// personalia header og tabsene uten å måtte rendre de på nytt.
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export const SaksbehandlerContext = createContext<Partial<SaksbehandlerContextType>>({});

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const [innloggetSaksbehandler, setInnloggetSaksbehandler] = useState<
        Saksbehandler | undefined
    >();
    const { saksbehandler, isSaksbehandlerLoading } = useSaksbehandler();
    const getLayout = Component.getLayout ?? ((page) => page);

    useEffect(() => {
        setInnloggetSaksbehandler!(saksbehandler);
    }, [saksbehandler]);
    if (!innloggetSaksbehandler) return <Loader />;
    return (
        <>
            <Head>
                <title>Tiltakspenger saksbehandler</title>
            </Head>
            <FeatureTogglesProvider env={pageProps.env}>
                <SaksbehandlerContext.Provider
                    value={{ innloggetSaksbehandler, setInnloggetSaksbehandler }}
                >
                    {isSaksbehandlerLoading ? (
                        <Loader />
                    ) : (
                        <SWRConfig
                            value={{
                                shouldRetryOnError: false,
                                revalidateOnFocus: false,
                                revalidateOnReconnect: true,
                            }}
                        >
                            <HovedLayout>{getLayout(<Component {...pageProps} />)}</HovedLayout>
                        </SWRConfig>
                    )}
                </SaksbehandlerContext.Provider>
            </FeatureTogglesProvider>
        </>
    );
}
