import React, { FormEvent } from 'react';
import { Header as NavInternalHeader } from '@navikt/ds-react-internal';
import { Search } from '@navikt/ds-react';
import { Saksbehandler } from '../../types/Saksbehandler';
import styles from './Header.module.css';

interface HeaderProps {
    innloggetSaksbehandler: Saksbehandler;
    onSearch: (searchString: string) => void;
}

const Header = ({ innloggetSaksbehandler, onSearch }: HeaderProps) => {
    const { navIdent } = innloggetSaksbehandler;
    const [search, setSearch] = React.useState('');

    async function searchHandler(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        onSearch(search);
    }

    return (
        <React.Fragment>
            <NavInternalHeader>
                <NavInternalHeader.Title href="/">NAV Tiltakspenger</NavInternalHeader.Title>
                <div className={styles.header__searchWrapper}>
                    <form data-theme="dark" onSubmit={searchHandler}>
                        <Search label={''} onChange={(value) => setSearch(value)} autoComplete="off"></Search>
                    </form>
                </div>
                <NavInternalHeader.User className={styles.header__user} name={navIdent} />
            </NavInternalHeader>
        </React.Fragment>
    );
};

export default Header;
