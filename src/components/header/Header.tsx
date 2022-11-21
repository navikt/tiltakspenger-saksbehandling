import React, { FormEvent } from 'react';
import { Header as NavInternalHeader } from '@navikt/ds-react-internal';
import { Saksbehandler } from '../../types/Saksbehandler';
import styles from './Header.module.css';
import { Alert, Search } from '@navikt/ds-react';
import { useRouter } from 'next/router';

interface HeaderProps {
    innloggetSaksbehandler: Saksbehandler;
}

async function fetchSøker(personId: string): Promise<Response> {
    return await fetch('/api/soker', {
        method: 'post',
        body: JSON.stringify({
            ident: personId,
        }),
    });
}

const Header = ({ innloggetSaksbehandler }: HeaderProps) => {
    const { navIdent } = innloggetSaksbehandler;
    const [search, setSearch] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const router = useRouter();

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

    async function searchHandler(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();

        resetErrorMessage();

        const response = await fetchSøker(search);
        if (response.ok) {
            try {
                await redirectToSøkerPage(response);
            } catch (error) {
                console.error(error);
                showErrorMessage('Noe har gått galt ved henting av data om søker, vennligst prøv igjen senere');
            }
        } else if (response.status === 404) {
            showErrorMessage('Personen finnes ikke');
        } else if (response.status === 403) {
            showErrorMessage('Du har ikke tilgang til å se informasjon om denne brukeren');
        } else {
            showErrorMessage('Noe har gått galt ved henting av data om søker, vennligst prøv igjen senere');
        }
    }

    return (
        <React.Fragment>
            <NavInternalHeader>
                <NavInternalHeader.Title>NAV Tiltakspenger</NavInternalHeader.Title>
                <div className={styles.header__searchWrapper}>
                    <form data-theme="dark" onSubmit={searchHandler}>
                        <Search
                            label={''}
                            variant="simple"
                            onChange={(value) => setSearch(value)}
                            autoComplete="off"
                        ></Search>
                    </form>
                </div>
                <NavInternalHeader.User className={styles.header__user} name={navIdent} />
            </NavInternalHeader>
            {errorMessage && (
                <Alert variant="error" fullWidth>
                    {errorMessage}
                </Alert>
            )}
        </React.Fragment>
    );
};

export default Header;
