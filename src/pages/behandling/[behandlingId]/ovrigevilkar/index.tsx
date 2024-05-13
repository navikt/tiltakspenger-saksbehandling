import { pageWithAuthentication } from '../../../../utils/pageWithAuthentication';
import { Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../../../hooks/useHentBehandling';
import { BehandlingLayout } from '../../../../components/layout/BehandlingLayout';
import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { ReactElement, useContext } from 'react';
import { NextPageWithLayout, SaksbehandlerContext } from '../../../_app';
import { avklarLesevisning } from '../../../../utils/avklarLesevisning';
import { Vilkårsvurdering } from '../../../../components/vilkårsvurdering/Vilkårsvurdering';
import SøknadOppsummering from '../../../../components/søknad-oppsummering/SøknadOppsummering';
import { Saksdialog } from '../../../../components/saksdialog/Saksdialog';
import StønadsdagerVilkårsvurdering from '../../../../components/tiltaksdeltagelse-demo/StønadsdagerVilkårsvurdering';
import { tiltaksdeltagelseDTO } from '../../../../components/tiltaksdeltagelse-demo/types';

const Behandling: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <>
      <SøknadOppsummering
        søknad={valgtBehandling.søknad}
        registrerteTiltak={valgtBehandling.registrerteTiltak}
      />
      <StønadsdagerVilkårsvurdering tiltaksdeltagelser={tiltaksdeltagelseDTO} />
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
