import React, { FormEvent } from 'react';
import { Header as NavInternalHeader } from '@navikt/ds-react-internal';
import { Search } from '@navikt/ds-react';
import { Saksbehandler } from '../../types/Saksbehandler';
import styles from './Header.module.css';
import ContentLoader from 'react-content-loader';

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
                <form style={{ padding: '0 5px' }} onSubmit={searchHandler}>
                    <Search
                        data-testid="nav-search-input"
                        label={''}
                        variant="simple"
                        size="small"
                        placeholder="Søk på fødselsnummer"
                        onChange={(value) => setSearch(value.trim())}
                        value={search}
                        autoComplete="off"
                    >
                        <Search.Button loading={isSearchLoading} />
                    </Search>
                </form>
                {saksbehandler ? (
                    <NavInternalHeader.User className={styles.header__user} name={saksbehandler.navIdent} />
                ) : (
                    <div className={`navdsi-header__user ${styles.header__user}`}>
                        <ContentLoader
                            width={80}
                            height={20}
                            speed={1}
                            backgroundColor={'#333'}
                            foregroundColor={'#999'}
                        >
                            <rect rx="3" ry="3" width="120" height="15" />
                        </ContentLoader>
                    </div>
                )}
            </NavInternalHeader>
        </React.Fragment>
    );
};

export default Header;
