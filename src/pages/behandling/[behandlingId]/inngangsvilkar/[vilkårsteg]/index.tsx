import { BehandlingLayout } from '../../../../../components/layout/BehandlingLayout';
import { SaksbehandlingLayout } from '../../../../../components/layout/SaksbehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../../_app';
import { Saksdialog } from '../../../../../components/saksdialog/Saksdialog';
import { pageWithAuthentication } from '../../../../../auth/pageWithAuthentication';
import InngangsvilkårSidemeny from '../../../../../components/inngangsvilkår-sidemeny/InngangsvilkårSidemeny';
import Vilkårsteg from '../../../../../components/vilkårsteg/Vilkårsteg';

const Behandling: NextPageWithLayout = () => {
  return (
    <>
      <InngangsvilkårSidemeny />
      <Vilkårsteg />
      <Saksdialog />
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
