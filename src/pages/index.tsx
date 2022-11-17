import React from 'react';
import type { NextPage } from 'next';
import { TextField, Button } from '@navikt/ds-react';
import '@navikt/ds-css';
import { useRouter } from 'next/router';

type SøknadResponse = {
    ident: string;
    behandlinger: SøknadResponse[];
};

async function fetchSøknader(personId: string): Promise<SøknadResponse> {
    const response = await fetch('/api/person/soknader', {
        method: 'post',
        body: JSON.stringify({
            ident: personId,
        }),
    });
    const data = await response.json();
    return data;
}

const Home: NextPage = () => {
    const router = useRouter();

    async function getPerson(personId: string) {
        try {
            const { behandlinger } = await fetchSøknader(personInput);
            setSøknader(behandlinger);
        } catch (error) {
            console.error('Noe gikk galt ved henting av søknader');
        }
    }

    const [personInput, setPersonInput] = React.useState('');
    const [søknader, setSøknader] = React.useState<SøknadResponse[]>([]);

    return (
        <div style={{ padding: '1rem' }}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    getPerson(personInput);
                }}
            >
                <TextField label="Oppgi person" onChange={({ target }) => setPersonInput(target.value)} />
                <Button style={{ marginTop: '0.5rem' }}>Søk</Button>
            </form>
            {/*<ul>*/}
            {/*    {(søknader || []).map((søknad) => (*/}
            {/*        <li onClick={() => router.push(`/soknad/${søknad.søknadId}`)}>{søknad.søknadId}</li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
        </div>
    );
};

export default Home;
