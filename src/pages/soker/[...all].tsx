import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { atom, useAtom } from 'jotai';
import { Alert } from '@navikt/ds-react';
import SøknadSummarySection from '../../components/søknad-summary-section/SøknadSummarySection';
import PersonaliaHeader from '../../components/personalia-header/PersonaliaHeader';
import Søker from '../../types/Søker';
import SøknadTabs from '../../components/søknad-tabs/SøknadTabs';
import { SøkerLayout } from '../../layouts/soker/SøkerLayout';
import { fetcher } from '../../utils/http';
import useSWR from 'swr';

export const søknadIdAtom = atom('');

export const søkerFetcher = (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, init)
        .then((res) => res.json())
        .then((data) => {
            try {
                console.log('data lol', data);
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

    const { data, error, isLoading } = useSWR<Søker>(`/api/person/soknader/${søkerId}`, fetcher, {
        shouldRetryOnError: false,
    });

    function setDefaultActiveSøknadId() {
        if (søknadId) {
            setActiveSøknadId(søknadId);
        } else if (data) {
            const behandlinger = (data as Søker).behandlinger;
            setActiveSøknadId(behandlinger[0].søknad.id);
        }
    }

    useEffect(() => {
        if (!isLoading) {
            setDefaultActiveSøknadId();
        }
    }, [data]);

    function redirectToSøknadPage(id: string) {
        return router.push(`/soker/${søkerId}/${id}`);
    }

    function søkerRequestHasFailed() {
        return !!error;
    }

    if (isLoading) {
        return <div>Henter data om søknad</div>;
    }
    if (søkerRequestHasFailed()) {
        return <div>{error}</div>;
    }

    const søkerData = new Søker(data);
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
