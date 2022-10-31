import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import SøknadSummarySection from '../../components/søknad-summary-section/SøknadSummarySection';
import SøknadDetailSection from '../../components/søknad-detail-section/SøknadDetailSection';
import { SøknadResponse } from '../../types/Søknad';
import styles from './Søknad.module.css';

const SøknadPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [søknadResponse, setSøknadResponse] = React.useState<SøknadResponse | null>(null);

    React.useEffect(() => {
        async function fetchSøknadsdetaljer() {
            if (!!id) {
                const response = await fetch(`/api/soknad/${id}`);
                const søknadsdata = await response.json();
                setSøknadResponse(søknadsdata);
            }
        }
        fetchSøknadsdetaljer();
    }, [id]);

    if (søknadResponse === null) {
        return <div>Henter data om søknad {id}</div>;
    } else {
        return (
            <div className={styles.søknadWrapper}>
                <SøknadSummarySection søknad={søknadResponse.søknad} />
                <div className={styles.verticalLine}></div>
                {/*<SøknadDetailSection søknad={søknadsdetaljer} />*/}
            </div>
        );
    }
};

export default SøknadPage;
