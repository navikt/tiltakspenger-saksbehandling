import React, { FormEvent } from 'react';
import { Header as NavInternalHeader } from '@navikt/ds-react-internal';
import { Search } from '@navikt/ds-react';
import { Saksbehandler } from '../../types/Saksbehandler';
import styles from './Header.module.css';
import Loaders from '../loaders/Loaders';

interface HeaderProps {
    saksbehandler?: Saksbehandler;
    onSearch: (searchQuery: string) => void;
    isSearchLoading: boolean;
}

const Header = ({ saksbehandler, onSearch, isSearchLoading }: HeaderProps) => {
    const [search, setSearch] = React.useState('');

    async function searchHandler(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        onSearch(search);
    }

    return (
        <React.Fragment>
            <NavInternalHeader>
                <NavInternalHeader.Title data-testid="nav-header" href="/">
                    NAV Tiltakspenger
                </NavInternalHeader.Title>
                <div className={styles.header__searchWrapper}>
                    <form onSubmit={searchHandler}>
                        <Search
                            data-testid="nav-search-input"
                            label={''}
                            placeholder="Søk på fødselsnummer"
                            onChange={(value) => setSearch(value.trim())}
                            value={search}
                            autoComplete="off"
                        >
                            <Search.Button loading={isSearchLoading} />
                        </Search>
                    </form>
                </div>
                {saksbehandler ? (
                    <NavInternalHeader.User className={styles.header__user} name={saksbehandler.navIdent} />
                ) : (
                    <Loaders.User />
                )}
            </NavInternalHeader>
        </React.Fragment>
    );
};

export default Header;
