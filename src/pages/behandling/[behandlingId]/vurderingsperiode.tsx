import { HStack } from '@navikt/ds-react';
import { NextPageWithLayout } from '../../_app';
import { ReactElement, useContext } from 'react';
import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import {
  BehandlingContext,
  FørstegangsbehandlingLayout,
} from '../../../components/layout/FørstegangsbehandlingLayout';
import styles from '../Behandling.module.css';
import { fetcher } from '../../../utils/http';
import { preload } from 'swr';
import Vurderingsperiode from '../../../components/vurderingsperiode/Vurderingsperiode';
import Søknadsdetaljer from '../../../components/vurderingsperiode/Søknadsdetaljer';

const Behandling: NextPageWithLayout = () => {
  const { behandlingId, sakId } = useContext(BehandlingContext);
  preload(`/api/sak/${sakId}/personopplysninger`, fetcher);
  preload(`/api/behandling/${behandlingId}`, fetcher);
  return (
    <HStack
      role="tabpanel"
      wrap={false}
      className={styles.behandlingLayout}
      aria-labelledby="vurderingsperiode-tab"
      id="vurderingsperiode-panel"
      tabIndex={0}
    >
      <Søknadsdetaljer />
      <Vurderingsperiode />
    </HStack>
  );
};

Behandling.getLayout = function getLayout(page: ReactElement) {
  return <FørstegangsbehandlingLayout>{page}</FørstegangsbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Behandling;
