import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { BehandlingLayout } from '../../../../components/layout/BehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';
import { useRouter } from 'next/router';
import { UtbetalingMeny } from '../../../../components/utbetaling/utbetaling-meny/UtbetalingMeny';
import { UtbetalingDetaljer } from '../../../../components/utbetaling/utbetaling-detaljer/UtbetalingDetaljer';
import { UtbetalingSide } from '../../../../components/utbetaling/utbetaling-side/UtbetalingSide';
import { pageWithAuthentication } from '../../../../utils/pageWithAuthentication';

const Utbetaling: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;

  return (
    <>
      <UtbetalingMeny behandlingId={behandlingId} />
      <UtbetalingSide />
      <UtbetalingDetaljer />
    </>
  );
};

Utbetaling.getLayout = function getLayout(page: ReactElement) {
  return (
    <SaksbehandlingLayout>
      <BehandlingLayout>{page}</BehandlingLayout>
    </SaksbehandlingLayout>
  );
};

export const getServerSideProps = pageWithAuthentication();

export default Utbetaling;
