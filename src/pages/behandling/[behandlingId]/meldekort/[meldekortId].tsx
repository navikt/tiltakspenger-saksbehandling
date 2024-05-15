import { useRouter } from 'next/router';
import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { BehandlingLayout } from '../../../../components/layout/BehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';
import { MeldekortMeny } from '../../../../components/meldekort-meny/MeldekortMeny';
import { MeldekortSide } from '../../../../components/meldekort-side/MeldekortSide';
import { MeldekortDetaljer } from '../../../../components/meldekort-detaljer/MeldekortDetaljer';
import { pageWithAuthentication } from '../../../../utils/pageWithAuthentication';

const Meldekort: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;

  return (
    <>
      <MeldekortMeny behandlingId={behandlingId} />
      <MeldekortSide />
      <MeldekortDetaljer />
    </>
  );
};

Meldekort.getLayout = function getLayout(page: ReactElement) {
  return (
    <SaksbehandlingLayout>
      <BehandlingLayout>{page}</BehandlingLayout>
    </SaksbehandlingLayout>
  );
};

export const getServerSideProps = pageWithAuthentication();

export default Meldekort;
