import {
  BehandlingContext,
  SaksbehandlingLayout,
} from '../../../../components/layout/SaksbehandlingLayout';
import { ReactElement, useContext } from 'react';
import { NextPageWithLayout } from '../../../_app';
import { MeldekortMeny } from '../../../../components/meldekort/meldekortmeny/MeldekortMeny';
import { MeldekortSide } from '../../../../components/meldekort/meldekortside/MeldekortSide';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import styles from '../../Behandling.module.css';
import { Box, HStack } from '@navikt/ds-react';
import Varsel from '../../../../components/varsel/Varsel';

const Meldekort: NextPageWithLayout = () => {
  const { meldekortId } = useContext(BehandlingContext);

  return (
    <HStack
      wrap={false}
      className={styles.behandlingLayout}
      role="tabpanel"
      aria-labelledby="meldekort-tab"
      id="meldekort-panel"
      tabIndex={2}
    >
      {meldekortId ? (
        <>
          <MeldekortMeny />
          <MeldekortSide />
        </>
      ) : (
        <Box padding="5">
          <Varsel
            variant="error"
            melding={`Kunne ikke hente meldekort for behandlingen)`}
          />
        </Box>
      )}
    </HStack>
  );
};

Meldekort.getLayout = function getLayout(page: ReactElement) {
  return <SaksbehandlingLayout>{page}</SaksbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Meldekort;
