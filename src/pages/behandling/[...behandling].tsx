import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { atom } from 'jotai';
import SøknadSummarySection from '../../components/søknad-summary-section/SøknadSummarySection';
import PersonaliaHeader from '../../components/personalia-header/PersonaliaHeader';
import SøknadTabs from '../../components/søknad-tabs/SøknadTabs';
import { SøkerLayout } from '../../layouts/soker/SøkerLayout';
import Loaders from '../../components/loaders/Loaders';
import useSoknader from '../../core/useSoknader';

export const søknadIdAtom = atom('');

const Behandling: NextPage = () => {
    const router = useRouter();
    const [søkerId, søknadId] = router.query.all as string[];

    const { data, valgtBehandling, isLoading } = useSoknader(søkerId, søknadId);

    if (isLoading) {
        return <Loaders.Page />;
    }

    return (
        <SøkerLayout>
            <PersonaliaHeader personalia={data!!.personopplysninger} />
            <SøknadSummarySection behandling={valgtBehandling!!} />
           

        </SøkerLayout>
    );
};

export default Behandling;
