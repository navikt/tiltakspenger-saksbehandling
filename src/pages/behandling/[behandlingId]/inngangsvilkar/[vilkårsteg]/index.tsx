import {
    BehandlingContext,
    FørstegangsbehandlingLayout,
} from '../../../../../components/layout/FørstegangsbehandlingLayout';
import { ReactElement, useContext } from 'react';
import { NextPageWithLayout } from '../../../../_app';
import { pageWithAuthentication } from '../../../../../auth/pageWithAuthentication';
import Inngangsvilkårmeny from '../../../../../components/inngangsvilkårmeny/Inngangsvilkårmeny';
import Vilkårsteg from '../../../../../components/vilkårsteg/Vilkårsteg';
import { HStack } from '@navikt/ds-react';
import styles from '../../../Behandling.module.css';
import { fetcher } from '../../../../../utils/http';
import { preload } from 'swr';

const Behandling: NextPageWithLayout = () => {
    const { behandlingId, sakId } = useContext(BehandlingContext);
    preload(`/api/sak/${sakId}/personopplysninger`, fetcher);
    preload(`/api/behandling/${behandlingId}`, fetcher);

    return (
        <HStack
            wrap={false}
            className={styles.behandlingLayout}
            role="tabpanel"
            aria-labelledby="inngangsvilkår-tab"
            id="inngangsvilkår-panel"
            tabIndex={1}
        >
            <Inngangsvilkårmeny />
            <Vilkårsteg />
        </HStack>
    );
};

Behandling.getLayout = function getLayout(page: ReactElement) {
    return <FørstegangsbehandlingLayout>{page}</FørstegangsbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Behandling;
