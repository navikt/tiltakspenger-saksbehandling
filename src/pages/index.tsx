import React from 'react';
import type { NextPage } from 'next';
import { TextField, Button } from '@navikt/ds-react';
import '@navikt/ds-css';
import { useRouter } from 'next/router';
import SøknadSummarySection from '../components/søknad-summary-section/SøknadSummarySection';
import { Html } from 'next/document';

type Søknad = {
    søknadId: string,
    arrangoernavn: string,
    tiltakskode: string,
    startdato: string,
    sluttdato?: string,
};

type SøknadResponse = {
    ident: string;
    søknader: Søknad[];
};

async function fetchSøknader(personId: string): Promise<SøknadResponse> {
    const response = await fetch('/api/person/soknader');
    const data = await response.json();
    return data;
}

const Home: NextPage = () => {
    const router = useRouter();

    async function getPerson(personId: string) {
        try {
            const { søknader } = await fetchSøknader(personInput);
            setSøknader(søknader);
        } catch(error)
        {
            console.error(error);
        }
        
    }

    const [personInput, setPersonInput] = React.useState('');
    const [søknader, setSøknader] = React.useState<Søknad[]>([]);

    return (
        <div style={{ padding: '1rem' }}>
            <TextField label="Oppgi person" onChange={({ target }) => setPersonInput(target.value)} />
            <Button style={{ marginTop: '0.5rem' }} onClick={() => getPerson(personInput)}>
                Søk
            </Button>
            <ul>{søknader.map((søknad) => <li>{søknad.søknadId}</li>)}</ul>
        </div>
    );
};

export default Home;
