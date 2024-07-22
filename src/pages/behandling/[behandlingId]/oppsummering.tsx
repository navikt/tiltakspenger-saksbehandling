import { Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import Oppsummering from '../../../components/oppsummering/Oppsummering';
import { NextPageWithLayout } from '../../_app';
import { ReactElement } from 'react';
import { pageWithAuthentication } from '../../../auth/pageWithAuthentication';
import { BehandlingLayout } from '../../../components/layout/BehandlingLayout';
import { SaksbehandlingLayout } from '../../../components/layout/SaksbehandlingLayout';
import { useHentBehandling } from '../../../hooks/useHentBehandling';
import { Skuff } from '../../../components/skuff/Skuff';
import Behandlingdetaljer from '../../../components/behandlingdetaljer/Behandlingdetaljer';

const Behandling: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <>
      <Skuff venstreOrientert headerTekst={'Detaljer'}>
        <Behandlingdetaljer />
      </Skuff>
      <Oppsummering />
    </>
  );
};

Behandling.getLayout = function getLayout(page: ReactElement) {
  return (
    <SaksbehandlingLayout>
      <BehandlingLayout>{page}</BehandlingLayout>
    </SaksbehandlingLayout>
  );
};

export const getServerSideProps = pageWithAuthentication();

export default Behandling;
