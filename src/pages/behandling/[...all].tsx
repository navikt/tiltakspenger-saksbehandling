import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { atom } from 'jotai';
import SøknadSummarySection from '../../containers/søknad-summary-section/SøknadSummarySection';
import PersonaliaHeader from '../../containers/personalia-header/PersonaliaHeader';
import BehandlingTabs from '../../containers/søknad-tabs/BehandlingTabs';
import { SøkerLayout } from '../../layouts/soker/SøkerLayout';
import Loaders from '../../components/loaders/Loaders';
import { pageWithAuthentication } from '../../utils/pageWithAuthentication';
import { useBehandling } from '../../core/useBehandling';
import { BehandlingKnapper } from '../../containers/behandling-knapper/BehandlingKnapper';
import { Tag } from '@navikt/ds-react';
import styles from './Soker.module.css';

export const søknadIdAtom = atom('');

const BehandlingPage: NextPage = () => {
    const router = useRouter();
    const [behandlingId] = router.query.all as string[];

    const { valgtBehandling, isLoading } = useBehandling(behandlingId);

    if (isLoading || !valgtBehandling) {
        return <Loaders.Page />;
    }

    return (
        <SøkerLayout>
            <PersonaliaHeader personopplysninger={valgtBehandling.personopplysninger} />
            <Tag variant="info-filled" size="medium" className={styles.behandlingtag}>
                Førstegangsbehandling
            </Tag>
            <BehandlingKnapper behandlingid={valgtBehandling.behandlingId} tilstand={valgtBehandling.tilstand} />
            <SøknadSummarySection søknad={valgtBehandling.søknad} />
            <BehandlingTabs
                onChange={(id) => router.push(`/behandling/${valgtBehandling?.behandlingId}/${id}`)}
                defaultTab={'Inngangsvilkår'}
                behandling={valgtBehandling}
            />
        </SøkerLayout>
    );
};

export default BehandlingPage;

export const getServerSideProps = pageWithAuthentication();
