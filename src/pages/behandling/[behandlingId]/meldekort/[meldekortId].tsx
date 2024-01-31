import { useRouter } from 'next/router';
import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { BehandlingLayout } from '../../../../components/layout/BehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';
import { MeldekortMeny } from '../../../../components/meldekort-meny/MeldekortMeny';
import { MeldekortSide } from '../../../../components/meldekort-side/MeldekortSide';
import { MeldekortDetaljer } from '../../../../components/meldekort-detaljer/MeldekortDetaljer';
import { useHentMeldekortListe } from '../../../../hooks/useHentMeldekortListe';
import { useHentMeldekort } from '../../../../hooks/useHentMeldekort';
import { Loader } from '@navikt/ds-react';

const Meldekort: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { meldekortliste } = useHentMeldekortListe(behandlingId);
  const { meldekort, isLoading } = useHentMeldekort(
    meldekortliste ? meldekortliste[0].id : undefined
  );

  if (isLoading || !meldekort) return <Loader />;

  return (
    <>
      <MeldekortMeny behandlingId={behandlingId} />
      <MeldekortSide meldekort={meldekort} />
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

export default Meldekort;
