import React from 'react';
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
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();
    return (
        <>
            <NavInternalHeader>
                <NavInternalHeader.Title>NAV Tiltakspenger</NavInternalHeader.Title>
                <form
                    data-theme="dark"
                    onSubmit={async (e) => {
                        setError(null);
                        e.preventDefault();
                        e.stopPropagation();
                        const response = await fetchSøker(search);
                        if (response.ok) {
                            const data = await response.json();
                            return router.push(`/soker/${data.id}`);
                        }
                        setError('Bruker finnes ikke');
                    }}
                >
                    <Search
                        className={styles.header__search}
                        label={''}
                        variant="simple"
                        onChange={(value) => setSearch(value)}
                    ></Search>
                </form>
                <NavInternalHeader.User className={styles.header__user} name={navIdent} />
            </NavInternalHeader>
            {error && (
                <Alert variant="error" fullWidth>
                    {error}
                </Alert>
            )}
        </>
    );
};

export default Header;
