import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';
import { MeldekortMeny } from '../../../../components/meldekort/meldekort-meny/MeldekortMeny';
import { MeldekortSide } from '../../../../components/meldekort/meldekort-side/MeldekortSide';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import styles from '../../Behandling.module.css';
import { HStack } from '@navikt/ds-react';

const Meldekort: NextPageWithLayout = () => {
  return (
    <HStack
      wrap={false}
      className={styles.behandlingLayout}
      role="tabpanel"
      aria-labelledby="meldekort-tab"
      id="meldekort-panel"
      tabIndex={2}
    >
      <MeldekortMeny />
      <MeldekortSide />
    </HStack>
  );
};

Meldekort.getLayout = function getLayout(page: ReactElement) {
  return <SaksbehandlingLayout>{page}</SaksbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Meldekort;
