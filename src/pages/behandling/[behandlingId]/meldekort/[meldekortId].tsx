import { useRouter } from 'next/router';
import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { BehandlingLayout } from '../../../../components/layout/BehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';

const Meldekort: NextPageWithLayout = () => {
  return <p>hei hei Meldekort</p>;
};

Meldekort.getLayout = function getLayout(page: ReactElement) {
  return (
    <SaksbehandlingLayout>
      <BehandlingLayout>{page}</BehandlingLayout>
    </SaksbehandlingLayout>
  );
};

export default Meldekort;
