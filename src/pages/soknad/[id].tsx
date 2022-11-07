import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import SøknadSummarySection from '../../components/søknad-summary-section/SøknadSummarySection';
import { SøknadResponse } from '../../types/Søknad';
import DetailSection from '../../components/detail-section/DetailSection';
import styles from './Søknad.module.css';
import PersonaliaHeader from '../../components/personalia-header/PersonaliaHeader';
import { ApiError } from '../../types/Error';

const SøknadPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [søknadResponse, setSøknadResponse] = React.useState<SøknadResponse | ApiError | null>(null);

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

    if (søknadResponse === null || søknadResponse === undefined) {
        return <div>Henter data om søknad</div>;
    }

    const erroneousResponse = søknadResponse as ApiError;
    if (erroneousResponse.error) {
        return <div>{erroneousResponse.error}</div>;
    } else {
        const søknadData = søknadResponse as SøknadResponse;
        return (
            <>
                <PersonaliaHeader personalia={søknadData.personopplysninger}></PersonaliaHeader>
                <div className={styles.søknadWrapper}>
                    <SøknadSummarySection søknadResponse={søknadData} />
                    <div className={styles.verticalLine}></div>
                    <DetailSection søknadResponse={søknadData} />
                </div>
            </>
        );
    }
};

export default SøknadPage;
