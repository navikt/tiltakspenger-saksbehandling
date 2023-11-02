import React, { FormEvent } from 'react';
import { InternalHeader } from '@navikt/ds-react';
import { Search } from '@navikt/ds-react';
import { Saksbehandler } from '../../types/Saksbehandler';
import styles from './Header.module.css';
import Loaders from '../../components/loaders/Loaders';

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
            <InternalHeader>
                <InternalHeader.Title data-testid="nav-header" href="/">
                    NAV Tiltakspenger
                </InternalHeader.Title>
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
                    <InternalHeader.User className={styles.header__user} name={saksbehandler.navIdent} />
                ) : (
                    <Loaders.User />
                )}
            </InternalHeader>
        </React.Fragment>
    );
};

export default Header;
