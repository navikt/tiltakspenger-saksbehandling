import type { NextPage } from 'next';
import { TextField } from '@navikt/ds-react';
import '@navikt/ds-css';

const Home: NextPage = () => {
    return <TextField label="Søk etter person" />;
};

export default Home;
