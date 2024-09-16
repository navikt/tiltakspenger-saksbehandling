import { HStack } from '@navikt/ds-react';
import Oppsummering from '../../../components/oppsummering/Oppsummering';
import { NextPageWithLayout } from '../../_app';
import { ReactElement } from 'react';
import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { FørstegangsbehandlingLayout } from '../../../components/layout/FørstegangsbehandlingLayout';
import Behandlingdetaljer from '../../../components/behandlingdetaljer/Behandlingdetaljer';
import styles from '../Behandling.module.css';

const Behandling: NextPageWithLayout = () => (
  <HStack
    role="tabpanel"
    wrap={false}
    className={styles.behandlingLayout}
    aria-labelledby="meldekort-tab"
    id="meldekort-panel"
    tabIndex={1}
  >
    <Behandlingdetaljer />
    <Oppsummering />
  </HStack>
);

Behandling.getLayout = function getLayout(page: ReactElement) {
  return <FørstegangsbehandlingLayout>{page}</FørstegangsbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Behandling;
