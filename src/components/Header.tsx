import React from 'react';
import { Header as NavInternalHeader } from '@navikt/ds-react-internal';

const Header = () => (
    <NavInternalHeader>
        <NavInternalHeader.Title>Test</NavInternalHeader.Title>
        <NavInternalHeader.User name="Foo Bar" style={{ marginLeft: 'auto', marginRight: 0 }} />
    </NavInternalHeader>
);

export default Header;
