import React from 'react';
import type { NextPage } from 'next';
import '@navikt/ds-css';

type SøknadResponse = {
    ident: string;
    behandlinger: SøknadResponse[];
};

const Home: NextPage = () => {
    return (
        <div style={{ paddingLeft: '1rem' }}>
            <p>Start med å søke opp en person i søkefeltet.</p>
        </div>
    );
};

export default Home;
