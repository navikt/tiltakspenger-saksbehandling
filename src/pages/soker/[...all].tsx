import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { atom } from 'jotai';
import SøknadSummarySection from '../../components/søknad-summary-section/SøknadSummarySection';
import PersonaliaHeader from '../../components/personalia-header/PersonaliaHeader';
import BehandlingTabs from '../../components/søknad-tabs/BehandlingTabs';
import { SøkerLayout } from '../../layouts/soker/SøkerLayout';
import Loaders from '../../components/loaders/Loaders';
import { pageWithAuthentication } from '../../utils/pageWithAuthentication';
import { useBehandling } from '../../core/useBehandling';
import { Tag } from '@navikt/ds-react';
import styles from './Soker.module.css';

export const søknadIdAtom = atom('');

const SøkerPage: NextPage = () => {
    const router = useRouter();
    const [søkerId, søknadId] = router.query.all as string[];

    const { valgtBehandling, isLoading } = useBehandling('beh_01H27W28VJSRPR1ESE5ASR04N8'); // todo: gjørnome

    if (isLoading || !valgtBehandling) {
        return <Loaders.Page />;
    }

    return (
        <SøkerLayout>
            <PersonaliaHeader personopplysninger={valgtBehandling.personopplysninger} />
            <Tag variant="info-filled" size="medium" className={styles.behandlingtag}>
                Førstegangsbehandling
            </Tag>
            <SøknadSummarySection søknad={valgtBehandling.søknad} />
            <BehandlingTabs
                onChange={(id) => router.push(`/soker/${søkerId}/${id}`)}
                defaultTab={'Inngangsvilkår'}
                behandling={valgtBehandling}
            />
        </SøkerLayout>
    );
};

export default SøkerPage;

export const getServerSideProps = pageWithAuthentication();
