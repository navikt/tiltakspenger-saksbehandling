import { AppProps } from 'next/app';
import '@navikt/ds-css';
import '@navikt/ds-css-internal';
import useSWR from 'swr';
import Header from '../components/header/Header';
import { fetcher } from '../utils/http';
import { Saksbehandler } from '../types/Saksbehandler';
import './../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
    const { data, error } = useSWR<Saksbehandler>('/api/saksbehandler', fetcher);
    if (error) {
        return <div>Noe gikk galt ved lasting av siden</div>;
    }
    if (!data) {
        return <div>Laster...</div>;
    }
    return (
        <div>
            <Header innloggetSaksbehandler={data} />
            <Component {...pageProps} />
        </div>
    );
}
