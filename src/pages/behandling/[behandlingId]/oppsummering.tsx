import { HStack, Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import Oppsummering from '../../../components/oppsummering/Oppsummering';
import { NextPageWithLayout } from '../../_app';
import { ReactElement } from 'react';
import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { SaksbehandlingLayout } from '../../../components/layout/SaksbehandlingLayout';
import { useHentBehandling } from '../../../hooks/useHentBehandling';
import { Skuff } from '../../../components/skuff/Skuff';
import Behandlingdetaljer from '../../../components/behandlingdetaljer/Behandlingdetaljer';
import styles from '../Behandling.module.css';

const Behandling: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
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
};

Behandling.getLayout = function getLayout(page: ReactElement) {
  return <SaksbehandlingLayout>{page}</SaksbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Behandling;
