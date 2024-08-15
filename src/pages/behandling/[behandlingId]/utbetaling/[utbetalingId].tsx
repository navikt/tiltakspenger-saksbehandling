import {
  BehandlingContext,
  SaksbehandlingLayout,
} from '../../../../components/layout/SaksbehandlingLayout';
import { ReactElement, useContext } from 'react';
import { NextPageWithLayout } from '../../../_app';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import { Box, HStack } from '@navikt/ds-react';
import styles from '../../Behandling.module.css';
import Varsel from '../../../../components/varsel/Varsel';
import { Utbetalingmeny } from '../../../../components/utbetaling/utbetalingmeny/Utbetalingmeny';
import { Utbetalingsside } from '../../../../components/utbetaling/utbetalingside/Utbetalingsside';

const Utbetaling: NextPageWithLayout = () => {
  const { utbetalingId } = useContext(BehandlingContext);
  return (
    <HStack
      wrap={false}
      className={styles.behandlingLayout}
      role="tabpanel"
      aria-labelledby="utbetaling-tab"
      id="utbetaling-panel"
      tabIndex={3}
    >
      {utbetalingId ? (
        <>
          <Utbetalingmeny />
          <Utbetalingsside />
        </>
      ) : (
        <Box padding="5">
          <Varsel variant={'error'} melding={'Kunne ikke hente utbetalinger'} />
        </Box>
      )}
    </HStack>
  );
};

Utbetaling.getLayout = function getLayout(page: ReactElement) {
  return <SaksbehandlingLayout>{page}</SaksbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Utbetaling;
