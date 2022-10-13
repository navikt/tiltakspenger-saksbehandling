import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import SøknadSummarySection from '../../components/SøknadSummarySection';
import SøknadDetailSection from '../../components/SøknadDetailSection';
import Søknad from '../../types/Søknad';
import styles from './Søknad.module.css';

async function fetchSøknadsdetaljer(søknadId: string): Promise<Søknad> {
    return Promise.resolve({
        id: '123',
        søknadsdato: '01.01.2024',
        registrertTiltak: {
            beskrivelse: 'Tiltaksbeskrivelse',
            periode: {
                fom: '01.01.2024',
                tom: '31.01.2024',
            },
        },
        status: 'Gjennomføres',
        antallDager: 5,
        prosent: 100,
    });
}

const SøknadPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [søknadsdetaljer, setSøknadsdetaljer] = React.useState<Søknad | null>(null);

    React.useEffect(() => {
        async function getSøknadsdetaljer(søknadId: string) {
            const søknadsdetaljer = await fetchSøknadsdetaljer(søknadId);
            setSøknadsdetaljer(søknadsdetaljer);
        }

        getSøknadsdetaljer(id as string);
    }, []);

    if (søknadsdetaljer === null) {
        return <div>Henter data om søknad {id}</div>;
    } else {
        return (
            <div className={styles.søknadWrapper}>
                <SøknadSummarySection søknad={søknadsdetaljer} />
                <div className={styles.verticalLine}></div>
                <SøknadDetailSection søknad={søknadsdetaljer} />
            </div>
        );
    }
};

export default SøknadPage;
