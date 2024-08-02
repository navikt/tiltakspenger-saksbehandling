import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';
import { UtbetalingMeny } from '../../../../components/utbetaling/utbetaling-meny/UtbetalingMeny';
import { UtbetalingSide } from '../../../../components/utbetaling/utbetaling-side/UtbetalingSide';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import { HStack } from '@navikt/ds-react';
import styles from '../../Behandling.module.css';

const Utbetaling: NextPageWithLayout = () => (
  <HStack
    wrap={false}
    className={styles.behandlingLayout}
    role="tabpanel"
    aria-labelledby="utbetaling-tab"
    id="utbetaling-panel"
    tabIndex={3}
  >
    <UtbetalingMeny />
    <UtbetalingSide />
  </HStack>
);

Utbetaling.getLayout = function getLayout(page: ReactElement) {
  return <SaksbehandlingLayout>{page}</SaksbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Utbetaling;
