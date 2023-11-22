import '@navikt/ds-css';
import React, {Dispatch, useState, SetStateAction, useEffect} from 'react';
import { AppProps } from 'next/app';
import { createContext} from 'react';
import Head from 'next/head';
import { PageLayout } from '../layouts/page/PageLayout';
import CustomToaster from '../components/toaster/Toaster';
import {Saksbehandler} from "../types/Saksbehandler";
import useSaksbehandler from "../core/useSaksbehandler";
import Loaders from "../components/loaders/Loaders";

interface SaksbehandlerContextType {
    innloggetSaksbehandler: Saksbehandler;
    setInnloggetSaksbehandler: Dispatch<SetStateAction<undefined | Saksbehandler>>;
}
export const SaksbehandlerContext = createContext<Partial<SaksbehandlerContextType>>({});

export default function MyApp({ Component, pageProps }: AppProps) {
    const [innloggetSaksbehandler, setInnloggetSaksbehandler] = useState<Saksbehandler | undefined>();
    const { saksbehandler, isSaksbehandlerLoading } = useSaksbehandler();

    useEffect(() => {
        setInnloggetSaksbehandler!(saksbehandler);
    }, [saksbehandler]);

    return (
        <>
            <Head>
                <title>Tiltakspenger saksbehandler</title>
            </Head>
            <SaksbehandlerContext.Provider value={{ innloggetSaksbehandler, setInnloggetSaksbehandler }}>
                {isSaksbehandlerLoading ? <Loaders.Page /> : (
                    <PageLayout>
                        <Component {...pageProps} />
                    </PageLayout>
                )}
            </SaksbehandlerContext.Provider>
            <CustomToaster />
        </>
    );
}
