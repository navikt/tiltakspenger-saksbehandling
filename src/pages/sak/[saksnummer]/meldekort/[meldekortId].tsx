import { HStack, VStack } from '@navikt/ds-react';
import { NextPage } from 'next';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import Meldekortdetaljer from '../../../../components/meldekort/meldekortdetaljer/Meldekortdetaljer';
import { MeldekortSide } from '../../../../components/meldekort/meldekortside/MeldekortSide';
import styles from '../../../behandling/Behandling.module.css';
import MeldekortHeader from '../../../../components/meldekort/meldekortheader/MeldekortHeader';

const Meldekort: NextPage = () => (
  <VStack>
    <MeldekortHeader />
    <HStack wrap={false} className={styles.behandlingLayout}>
      <Meldekortdetaljer />
      <MeldekortSide />
    </HStack>
  </VStack>
);

export const getServerSideProps = pageWithAuthentication();

export default Meldekort;
