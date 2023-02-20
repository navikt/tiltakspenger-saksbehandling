import React, { useEffect, useState } from 'react';
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
import { Behandling } from '../../types/Behandling';

export const søknadIdAtom = atom('');

const SøkerPage: NextPage = () => {
    const router = useRouter();
    const urlParams = router.query.all;
    const [søkerId, søknadId] = urlParams as string[];
    const [activeSøknadId, setActiveSøknadId] = useAtom(søknadIdAtom);
    const [valgtBehandling, setValgtBehandling] = useState<Behandling>();
    const [søkerData, setSøkerData] = useState<Søker>();

    const { data, error, isLoading } = useSWR<Søker>(`/api/person/soknader/${søkerId}`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        if (!isLoading) {
            const søker = new Søker(data);
            setSøkerData(søker);
            setDefaultActiveSøknadId();
        }
    }, [data]);

    useEffect(() => {
        if (activeSøknadId && søkerData) {
            setValgtBehandling(søkerData.behandlinger.find((behandling) => behandling.søknad.id === activeSøknadId));
        }
    }, [activeSøknadId]);

    function setDefaultActiveSøknadId() {
        if (søknadId) {
            setActiveSøknadId(søknadId);
        } else if (data) {
            const behandlinger = (data as Søker).behandlinger;
            setActiveSøknadId(behandlinger[0].søknad.id);
        }
    }

    function redirectToSøknadPage(id: string) {
        return router.push(`/soker/${søkerId}/${id}`);
    }

    function søkerRequestHasFailed() {
        return !!error;
    }

    if (isLoading && !søkerData) {
        return <div>Henter data om søknad</div>;
    }
    if (søkerRequestHasFailed()) {
        return <div>{error}</div>;
    }
    if (!valgtBehandling) {
        return <Alert variant="error">Fant ikke behandlingen</Alert>;
    }
    return (
        <SøkerLayout>
            <PersonaliaHeader personalia={søkerData!!.personopplysninger} />
            <SøknadSummarySection søknadResponse={valgtBehandling} />
            <SøknadTabs
                søkerId={søkerData!!.søkerId}
                onChange={(id) => redirectToSøknadPage(id)}
                defaultTab={activeSøknadId}
                behandlinger={søkerData!!.behandlinger}
                personalia={søkerData!!.personopplysninger}
            />
        </SøkerLayout>
    );
};

export default SøkerPage;
