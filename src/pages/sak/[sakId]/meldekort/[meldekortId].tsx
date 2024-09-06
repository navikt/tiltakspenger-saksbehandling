import { HStack } from '@navikt/ds-react';
import { NextPage } from 'next';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import Meldekortdetaljer from '../../../../components/meldekort/meldekortmeny/Meldekortdetaljer';
import { MeldekortSide } from '../../../../components/meldekort/meldekortside/MeldekortSide';
import styles from '../../../behandling/Behandling.module.css';

const Meldekort: NextPage = () => (
  <HStack wrap={false} className={styles.behandlingLayout}>
    <Meldekortdetaljer />
    <MeldekortSide />
  </HStack>
);

export const getServerSideProps = pageWithAuthentication();

export default Meldekort;
