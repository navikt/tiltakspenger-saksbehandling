import { pageWithAuthentication } from '../../../../../utils/pageWithAuthentication';
import { Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../../../../hooks/useHentBehandling';
import { BehandlingLayout } from '../../../../../components/layout/BehandlingLayout';
import { SaksbehandlingLayout } from '../../../../../components/layout/SaksbehandlingLayout';
import { ReactElement, useContext } from 'react';
import { NextPageWithLayout, SaksbehandlerContext } from '../../../../_app';
import { Saksdialog } from '../../../../../components/saksdialog/Saksdialog';
import InngangsvilkårSteg from '../../../../../components/inngangsvilkårsteg/InngangsvilkårSteg';
import BehandlingSteg from '../../../../../components/behandlingSteg/BehandlingSteg';

const Behandling: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <>
      <InngangsvilkårSteg />
      <BehandlingSteg />
      <Saksdialog endringslogg={valgtBehandling.endringslogg} />
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
