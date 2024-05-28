import { pageWithAuthentication } from '../../../../utils/pageWithAuthentication';
import { Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../../../hooks/useHentBehandling';
import { BehandlingLayout } from '../../../../components/layout/BehandlingLayout';
import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';
import SøknadOppsummering from '../../../../components/søknad-oppsummering/SøknadOppsummering';
import { Saksdialog } from '../../../../components/saksdialog/Saksdialog';
import Barnetillegg from '../../../../components/barnetillegg/Barnetillegg';

const Behandling: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <>
      <SøknadOppsummering
        søknad={valgtBehandling.søknad}
        registrerteTiltak={valgtBehandling.registrerteTiltak}
      />
      <Barnetillegg />
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
