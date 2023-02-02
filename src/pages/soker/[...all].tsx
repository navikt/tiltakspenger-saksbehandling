import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { atom, useAtom } from 'jotai';
import { Alert } from '@navikt/ds-react';
import SøknadSummarySection from '../../components/søknad-summary-section/SøknadSummarySection';
import PersonaliaHeader from '../../components/personalia-header/PersonaliaHeader';
import { ApiError } from '../../types/Error';
import Søker from '../../types/Søker';
import SøknadTabs from '../../components/søknad-tabs/SøknadTabs';
import { SøkerLayout } from '../../layouts/soker/SøkerLayout';

export const søknadIdAtom = atom('');

export const søkerFetcher = (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, init)
        .then((res) => res.json())
        .then((data) => {
            try {
                if (data.error) {
                    return Promise.reject(data.error);
                }
                const søker = new Søker(data);
                return Promise.resolve(søker);
            } catch (error) {
                return Promise.reject(error);
            }
        });

const SøkerPage: NextPage = () => {
    const router = useRouter();
    const urlParams = router.query.all;
    const [søkerId, søknadId] = urlParams as string[];
    const [activeSøknadId, setActiveSøknadId] = useAtom(søknadIdAtom);

    const { data: søkerResponse, error } = useSWR<Søker | ApiError>(`/api/person/soknader/${søkerId}`, søkerFetcher, {
        shouldRetryOnError: false,
    });

    function setDefaultActiveSøknadId() {
        if (søknadId) {
            setActiveSøknadId(søknadId);
        } else if (søkerResponse) {
            const behandlinger = (søkerResponse as Søker).behandlinger;
            setActiveSøknadId(behandlinger[0].søknad.id);
        }
    }

    React.useEffect(() => {
        const shouldRenderSøknadContent = !isWaitingForSøkerResponse() && !søkerRequestHasFailed();
        if (shouldRenderSøknadContent) {
            setDefaultActiveSøknadId();
        }
    }, [søkerResponse, error]);

    function redirectToSøknadPage(id: string) {
        return router.push(`/soker/${søkerId}/${id}`);
    }

    function isWaitingForSøkerResponse() {
        return (søkerResponse === null || søkerResponse === undefined) && !error;
    }

    function søkerRequestHasFailed() {
        return !!error;
    }

    if (isWaitingForSøkerResponse()) {
        return <div>Henter data om søknad</div>;
    }
    if (søkerRequestHasFailed()) {
        return <div>{error}</div>;
    }

    const søkerData = søkerResponse as Søker;
    const valgtBehandling = søkerData.behandlinger.find((behandling) => behandling.søknad.id === activeSøknadId);
    if (!valgtBehandling) {
        return <Alert variant="error">Fant ikke behandlingen</Alert>;
    }
    return (
        <SøkerLayout>
            <PersonaliaHeader personalia={søkerData.personopplysninger} />
            <SøknadSummarySection søknadResponse={valgtBehandling} />
            <SøknadTabs
                onChange={(id) => redirectToSøknadPage(id)}
                defaultTab={activeSøknadId}
                behandlinger={søkerData.behandlinger}
                personalia={søkerData.personopplysninger}
            />
        </SøkerLayout>
    );
};

export default SøkerPage;
