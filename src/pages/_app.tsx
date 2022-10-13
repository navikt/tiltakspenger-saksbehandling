import { AppProps } from 'next/app';
import '@navikt/ds-css';
import '@navikt/ds-css-internal';
import Header from '../components/header/Header';
import './../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div>
            <Header />
            <Component {...pageProps} />
        </div>
    );
}
