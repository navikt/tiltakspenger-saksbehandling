import { HStack } from '@navikt/ds-react';
import Oppsummering from '../../../components/oppsummering/Oppsummering';
import { NextPageWithLayout } from '../../_app';
import { ReactElement, useContext } from 'react';
import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import {
    BehandlingContext,
    FørstegangsbehandlingLayout,
} from '../../../components/layout/FørstegangsbehandlingLayout';
import Behandlingdetaljer from '../../../components/behandlingdetaljer/Behandlingdetaljer';
import styles from '../Behandling.module.css';
import { fetcher } from '../../../utils/http';
import { preload } from 'swr';

const Behandling: NextPageWithLayout = () => {
    const { behandlingId, sakId } = useContext(BehandlingContext);
    preload(`/api/sak/${sakId}/personopplysninger`, fetcher);
    preload(`/api/behandling/${behandlingId}`, fetcher);
    return (
        <HStack
            role="tabpanel"
            wrap={false}
            className={styles.behandlingLayout}
            aria-labelledby="oppsummering-tab"
            id="oppsummering-panel"
            tabIndex={2}
        >
            <Behandlingdetaljer />
            <Oppsummering />
        </HStack>
    );
};

Behandling.getLayout = function getLayout(page: ReactElement) {
    return <FørstegangsbehandlingLayout>{page}</FørstegangsbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Behandling;
