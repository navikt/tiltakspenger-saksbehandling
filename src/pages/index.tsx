import React from 'react';
import type { NextPage } from 'next';
import { TextField, Button } from '@navikt/ds-react';
import '@navikt/ds-css';
import { useRouter } from 'next/router';

type Søknad = {
    id: string;
};

type Person = {
    id: string;
    navn: string;
    søknader: Søknad[];
};

async function fetchPerson(personId: string): Promise<Person> {
    const response = await fetch('/saker/person');
    const data = await response.json();
    return data;
}

const Home: NextPage = () => {
    const router = useRouter();

    async function getPerson(personId: string) {
        const { søknader } = await fetchPerson('/api/person');
        await router.push(`/soknad/${søknader[0].id}`);
    }

    const [personInput, setPersonInput] = React.useState('');

    return (
        <div style={{ padding: '1rem' }}>
            <TextField label="Oppgi person" onChange={({ target }) => setPersonInput(target.value)} />
            <Button style={{ marginTop: '0.5rem' }} onClick={() => getPerson(personInput)}>
                Søk
            </Button>
        </div>
    );
};

export default Home;
