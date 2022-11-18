import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import SøknadSummarySection from '../../components/søknad-summary-section/SøknadSummarySection';
import PersonaliaHeader from '../../components/personalia-header/PersonaliaHeader';
import { fetcher } from '../../utils/http';
import { ApiError } from '../../types/Error';
import styles from './Søker.module.css';
import Søker from '../../types/Søker';
import SøknadTabs from '../../components/søknad-tabs/SøknadTabs';

const SøkerPage: NextPage = () => {
    const router = useRouter();
    const søkerId = (router.query.all as any)[0];
    const søknadId = (router.query.all as any)[1];
    const { data: søkerResponse, error } = useSWR<Søker | ApiError>(`/api/person/soknader/${søkerId}`, fetcher);

    const redirectToSøknad = (id: string) => {
        router.push(`/soker/${søkerId}/${id}`, undefined, { shallow: false });
    };

    if (søkerResponse === null || søkerResponse === undefined) {
        return <div>Henter data om søknad</div>;
    }

    if ((søkerResponse as ApiError).error || error) {
        return <div>{(søkerResponse as ApiError).error}</div>;
    } else {
        const søkerData = søkerResponse as Søker;
        return (
            <>
                <PersonaliaHeader personalia={søkerData.personopplysninger}></PersonaliaHeader>
                <div className={styles.søknadWrapper}>
                    <SøknadSummarySection søknadResponse={søkerData.behandlinger[0]} />
                    <div className={styles.verticalLine}></div>
                    <SøknadTabs
                        onChange={(id) => redirectToSøknad(id)}
                        defaultTab={søknadId || søkerData.behandlinger[0].søknad.id}
                        behandlinger={søkerData.behandlinger}
                    />
                </div>
            </>
        );
    }
};

export default SøkerPage;
