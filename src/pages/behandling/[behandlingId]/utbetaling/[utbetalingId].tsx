import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';
import { useRouter } from 'next/router';
import { UtbetalingMeny } from '../../../../components/utbetaling/utbetaling-meny/UtbetalingMeny';
import { UtbetalingDetaljer } from '../../../../components/utbetaling/utbetaling-detaljer/UtbetalingDetaljer';
import { UtbetalingSide } from '../../../../components/utbetaling/utbetaling-side/UtbetalingSide';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import { HStack } from '@navikt/ds-react';
import styles from '../../Behandling.module.css';

const Utbetaling: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;

  return (
    <HStack
      wrap={false}
      className={styles.behandlingLayout}
      role="tabpanel"
      aria-labelledby="utbetaling-tab"
      id="utbetaling-panel"
      tabIndex={3}
    >
      <UtbetalingMeny behandlingId={behandlingId} />
      <UtbetalingSide />
      <UtbetalingDetaljer />
    </HStack>
  );
};

Utbetaling.getLayout = function getLayout(page: ReactElement) {
  return <SaksbehandlingLayout>{page}</SaksbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Utbetaling;
