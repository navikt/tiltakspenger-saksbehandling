import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { atom, useAtom } from 'jotai';
import { Alert } from '@navikt/ds-react';
import SøknadSummarySection from '../../components/søknad-summary-section/SøknadSummarySection';
import PersonaliaHeader from '../../components/personalia-header/PersonaliaHeader';
import { fetcher } from '../../utils/http';
import { ApiError } from '../../types/Error';
import styles from './Søker.module.css';
import Søker from '../../types/Søker';
import SøknadTabs from '../../components/søknad-tabs/SøknadTabs';

export const søknadIdAtom = atom('');

const SøkerPage: NextPage = () => {
    const router = useRouter();
    const urlParams = router.query.all;
    const [søkerId, søknadId] = urlParams as string[];
    const { data: søkerResponse, error } = useSWR<Søker | ApiError>(`/api/person/soknader/${søkerId}`, fetcher);
    const [activeSøknadId, setActiveSøknadId] = useAtom(søknadIdAtom);

    function redirectToSøknadPage(id: string) {
        return router.push(`/soker/${søkerId}/${id}`);
    }

    function isWaitingForSøkerResponse() {
        return søkerResponse === null || søkerResponse === undefined;
    }

    function søkerRequestHasFailed() {
        const { error: søkerResponseError } = søkerResponse as ApiError;
        return søkerResponseError || error;
    }

    if (isWaitingForSøkerResponse()) {
        return <div>Henter data om søknad</div>;
    }
    if (søkerRequestHasFailed()) {
        return <div>{(søkerResponse as ApiError).error}</div>;
    }
    const søkerData = søkerResponse as Søker;
    const defaultValgtSøknadId = søknadId || søkerData.behandlinger[0].søknad.id;
    if (activeSøknadId === '') {
        setActiveSøknadId(defaultValgtSøknadId);
        return <div>Henter data om søknad</div>;
    } else {
        const valgtBehandling = søkerData.behandlinger.find((behandling) => behandling.søknad.id === activeSøknadId);
        if (!valgtBehandling) {
            return <Alert variant="error">Fant ikke behandlingen</Alert>;
        }
        return (
            <React.Fragment>
                <PersonaliaHeader personalia={søkerData.personopplysninger}></PersonaliaHeader>
                <div className={styles.søknadWrapper}>
                    <SøknadSummarySection søknadResponse={valgtBehandling} />
                    <div className={styles.verticalLine}></div>
                    <SøknadTabs
                        onChange={(id) => redirectToSøknadPage(id)}
                        defaultTab={defaultValgtSøknadId}
                        behandlinger={søkerData.behandlinger}
                    />
                </div>
            </React.Fragment>
        );
    }
};

export default SøkerPage;
