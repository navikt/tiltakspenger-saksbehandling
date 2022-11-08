import React from 'react';
import { Header as NavInternalHeader } from '@navikt/ds-react-internal';
import { Saksbehandler } from '../../types/Saksbehandler';
import styles from './Header.module.css';

interface HeaderProps {
    innloggetSaksbehandler: Saksbehandler;
}

const Header = ({ innloggetSaksbehandler }: HeaderProps) => {
    const { navIdent } = innloggetSaksbehandler;
    return (
        <NavInternalHeader>
            <NavInternalHeader.Title>NAV Tiltakspenger</NavInternalHeader.Title>
            <NavInternalHeader.User className={styles.header__user} name={navIdent} />
        </NavInternalHeader>
    );
};

export default Header;
