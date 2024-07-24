import { HStack } from '@navikt/ds-react';
import Oppsummering from '../../../components/oppsummering/Oppsummering';
import { NextPageWithLayout } from '../../_app';
import { ReactElement } from 'react';
import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { SaksbehandlingLayout } from '../../../components/layout/SaksbehandlingLayout';
import { Skuff } from '../../../components/skuff/Skuff';
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
    <Skuff venstreOrientert headerTekst={'Detaljer'}>
      <Behandlingdetaljer />
    </Skuff>
    <Oppsummering />
  </HStack>
);

Behandling.getLayout = function getLayout(page: ReactElement) {
  return <SaksbehandlingLayout>{page}</SaksbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Behandling;
