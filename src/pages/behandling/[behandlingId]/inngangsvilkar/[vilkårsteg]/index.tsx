import { FørstegangsbehandlingLayout } from '../../../../../components/layout/FørstegangsbehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../../_app';
import { pageWithAuthentication } from '../../../../../auth/pageWithAuthentication';
import InngangsvilkårSidemeny from '../../../../../components/inngangsvilkår-sidemeny/InngangsvilkårSidemeny';
import Vilkårsteg from '../../../../../components/vilkårsteg/Vilkårsteg';
import { HStack } from '@navikt/ds-react';
import styles from '../../../Behandling.module.css';

const Behandling: NextPageWithLayout = () => {
  return (
    <HStack
      wrap={false}
      className={styles.behandlingLayout}
      role="tabpanel"
      aria-labelledby="inngangsvilkår-tab"
      id="inngangsvilkår-panel"
      tabIndex={0}
    >
      <InngangsvilkårSidemeny />
      <Vilkårsteg />
    </HStack>
  );
};

Behandling.getLayout = function getLayout(page: ReactElement) {
  return <FørstegangsbehandlingLayout>{page}</FørstegangsbehandlingLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Behandling;
