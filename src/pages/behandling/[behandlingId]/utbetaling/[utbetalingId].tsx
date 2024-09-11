import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import { HStack } from '@navikt/ds-react';
import styles from '../../Behandling.module.css';

const Utbetaling: NextPageWithLayout = () => {
  return (
    <HStack
      wrap={false}
      className={styles.behandlingLayout}
      role="tabpanel"
      aria-labelledby="utbetaling-tab"
      id="utbetaling-panel"
      tabIndex={3}
    >
      {/*<Utbetalingmeny />
          <Utbetalingsside />*/}
    </HStack>
  );
};

Utbetaling.getLayout = function getLayout(page: ReactElement) {
  return <SaksbehandlingLayout>{page}</SaksbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Utbetaling;
