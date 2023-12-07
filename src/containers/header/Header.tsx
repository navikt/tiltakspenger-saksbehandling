import React, {FormEvent, useContext} from 'react';
import { InternalHeader } from '@navikt/ds-react';
import { Search } from '@navikt/ds-react';
import styles from './Header.module.css';
import Loaders from '../../components/loaders/Loaders';
import {SaksbehandlerContext} from "../../pages/_app";
import {useRouter} from "next/router";

interface HeaderProps {
    onSearch: (searchQuery: string) => void;
    isSearchLoading: boolean;
}

const Header = ({ onSearch, isSearchLoading }: HeaderProps) => {
    const router = useRouter();
    const [search, setSearch] = React.useState('');
    const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

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
                            onChange={(value) => {
                                const searchTerm = value.trim();
                                setSearch(searchTerm)
                                if (!searchTerm) {
                                    router.push('/');
                                }
                            }}
                            value={search}
                            autoComplete="off"
                        >
                            <Search.Button loading={isSearchLoading} />
                        </Search>
                    </form>
                </div>
                {innloggetSaksbehandler ? (
                    <InternalHeader.User className={styles.header__user} name={innloggetSaksbehandler.navIdent} />
                ) : (
                    <Loaders.User />
                )}
            </InternalHeader>
        </React.Fragment>
    );
};

export default Header;
