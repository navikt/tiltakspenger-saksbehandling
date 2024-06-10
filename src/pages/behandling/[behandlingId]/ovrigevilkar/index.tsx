import React, { ReactElement } from 'react';
import { pageWithAuthentication } from '../../../../utils/pageWithAuthentication';
import { Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../../../hooks/useHentBehandling';
import { BehandlingLayout } from '../../../../components/layout/BehandlingLayout';
import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { NextPageWithLayout } from '../../../_app';
import SøknadOppsummering from '../../../../components/søknad-oppsummering/SøknadOppsummering';
import { Saksdialog } from '../../../../components/saksdialog/Saksdialog';
import VilkårsvurderingAvStønadsdager from '../../../../components/vilkårsvurdering-av-stønadsdager/VilkårsvurderingAvStønadsdager';

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
      <VilkårsvurderingAvStønadsdager
        tiltak={valgtBehandling.registrerteTiltak}
      />
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
