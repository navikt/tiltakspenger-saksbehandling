import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import SøknadSummarySection from '../../components/søknad-summary-section/SøknadSummarySection';
import { SøknadResponse } from '../../types/Søknad';
import VilkårsvurderingDetails from '../../components/vilkårsvurdering-details/VilkårsvurderingDetails';
import PersonaliaHeader from '../../components/personalia-header/PersonaliaHeader';
import { fetcher } from '../../utils/http';
import { ApiError } from '../../types/Error';
import styles from './Søker.module.css';

const SøkerPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data: søknadResponse, error } = useSWR<SøknadResponse | ApiError>(`/api/person/soknader/${id}`, fetcher);

    if (søknadResponse === null || søknadResponse === undefined) {
        return <div>Henter data om søknad</div>;
    }

    if ((søknadResponse as ApiError).error || error) {
        return <div>{(søknadResponse as ApiError).error}</div>;
    } else {
        const søknadData = søknadResponse as SøknadResponse;
        return (
            <>
                <PersonaliaHeader personalia={søknadData.personopplysninger}></PersonaliaHeader>
                <div className={styles.søknadWrapper}>
                    <SøknadSummarySection søknadResponse={søknadData} />
                    <div className={styles.verticalLine}></div>
                    {/*<SøknadTabs søknadResponse={søknadData} />*/}
                </div>
            </>
        );
    }
};

export default SøkerPage;
