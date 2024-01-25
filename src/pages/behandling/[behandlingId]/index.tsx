import { pageWithAuthentication } from '../../../utils/pageWithAuthentication';
import { Loader } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../../hooks/useHentBehandling';
import { BehandlingLayout } from '../../../components/layout/BehandlingLayout';
import { SaksbehandlingLayout } from '../../../components/layout/SaksbehandlingLayout';
import { ReactElement, useContext } from 'react';
import { NextPageWithLayout, SaksbehandlerContext } from '../../_app';
import { avklarLesevisning } from '../../../utils/avklarLesevisning';
import { samletUtfall } from '../../../utils/samletUtfall';
import { Vilkårsvurdering } from '../../../components/vilkårsvurdering/Vilkårsvurdering';
import SøknadOppsummering from '../../../components/søknad-oppsummering/SøknadOppsummering';
import { Saksdialog } from '../../../components/saksdialog/Saksdialog';

const Behandling: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const girInnvilget = !valgtBehandling.saksopplysninger.find(
    (saksopplysning) => saksopplysning.samletUtfall !== 'OPPFYLT'
  );

  const lesevisning = avklarLesevisning(
    innloggetSaksbehandler!!,
    valgtBehandling.saksbehandler,
    valgtBehandling.beslutter,
    valgtBehandling.tilstand,
    girInnvilget
  );

  return (
    <>
      <SøknadOppsummering
        søknad={valgtBehandling.søknad}
        registrerteTiltak={valgtBehandling.registrerteTiltak}
      />
      <Vilkårsvurdering
        utfall={samletUtfall(valgtBehandling?.saksopplysninger)}
        valgtBehandling={valgtBehandling}
        lesevisning={lesevisning}
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
