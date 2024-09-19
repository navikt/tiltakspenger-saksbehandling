import { HStack, VStack } from '@navikt/ds-react';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import Meldekortdetaljer from '../../../../components/meldekort/meldekortdetaljer/Meldekortdetaljer';
import { MeldekortSide } from '../../../../components/meldekort/meldekortside/MeldekortsSide';
import styles from '../../../behandling/Behandling.module.css';
import MeldekortHeader from '../../../../components/meldekort/meldekortheader/MeldekortHeader';
import { NextPageWithLayout } from '../../../_app';
import { SakLayout } from '../../../../components/layout/SakLayout';
import { ReactElement } from 'react';

const Meldekort: NextPageWithLayout = () => (
  <VStack>
    <MeldekortHeader />
    <HStack wrap={false} className={styles.behandlingLayout}>
      <Meldekortdetaljer />
      <MeldekortSide />
    </HStack>
  </VStack>
);

Meldekort.getLayout = function getLayout(page: ReactElement) {
  return <SakLayout>{page}</SakLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Meldekort;
