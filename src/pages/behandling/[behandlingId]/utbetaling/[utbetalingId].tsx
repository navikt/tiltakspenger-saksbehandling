import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { BehandlingLayout } from '../../../../components/layout/BehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';

const Utbetaling: NextPageWithLayout = () => {
  return <p>Utbetaling</p>;
};

Utbetaling.getLayout = function getLayout(page: ReactElement) {
  return (
    <SaksbehandlingLayout>
      <BehandlingLayout>{page}</BehandlingLayout>
    </SaksbehandlingLayout>
  );
};

export default Utbetaling;
