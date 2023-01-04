import React from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '@navikt/ds-css';
import '@navikt/ds-css-internal';
import useSWR from 'swr';
import Header from '../components/header/Header';
import { fetcher, fetchSøker } from '../utils/http';
import { Saksbehandler } from '../types/Saksbehandler';
import ErrorMessage from '../components/error-message/ErrorMessage';
import './../styles/globals.css';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    require('../mock');
}

export default function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    const { data: innloggetSaksbehandler, error } = useSWR<Saksbehandler>('/api/saksbehandler', fetcher);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    function showErrorMessage(text: string) {
        setErrorMessage(text);
    }

    function resetErrorMessage() {
        setErrorMessage(null);
    }

    async function redirectToSøkerPage(response: Response) {
        const data = await response.json();
        return router.push(`/soker/${data.id}`);
    }

    function handleNotOkResponse(status: number) {
        if (status === 404) {
            showErrorMessage('Personen finnes ikke');
        } else if (status === 403) {
            showErrorMessage('Du har ikke tilgang til å se informasjon om denne brukeren');
        } else {
            showErrorMessage('Noe har gått galt ved henting av data om søker, vennligst prøv igjen senere');
        }
    }

    async function searchForSøker(searchString: string) {
        const response = await fetchSøker(searchString);
        if (response.ok) {
            try {
                await redirectToSøkerPage(response);
            } catch (error) {
                console.error(error);
                showErrorMessage('Noe har gått galt ved henting av data om søker, vennligst prøv igjen senere');
            }
        } else {
            handleNotOkResponse(response.status);
        }
    }

    if (error) {
        return <div>Noe gikk galt ved lasting av siden</div>;
    }
    if (!innloggetSaksbehandler) {
        return <div>Laster...</div>;
    }
    return (
        <React.Fragment>
            <title>Tiltakspenger saksbehandler</title>
            <Header
                innloggetSaksbehandler={innloggetSaksbehandler}
                onSearch={(searchString) => {
                    resetErrorMessage();
                    searchForSøker(searchString);
                }}
            />
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
            <Component {...pageProps} />
        </React.Fragment>
    );
}
