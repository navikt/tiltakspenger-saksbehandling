import React from 'react';
import { Header as NavInternalHeader } from '@navikt/ds-react-internal';
import styles from './Header.module.css';

const Header = () => (
    <NavInternalHeader>
        <NavInternalHeader.Title>NAV Tiltakspenger</NavInternalHeader.Title>
        <NavInternalHeader.User className={styles.header__user} name="Foo Bar" />
    </NavInternalHeader>
);

export default Header;
