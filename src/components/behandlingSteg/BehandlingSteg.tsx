import { VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { Behandlingssteg } from '../../types/Behandlingssteg';
import Alder from '../../steg/Alder';
import styles from './BehandlingSteg.module.css';
import VilkårsvurderingAvTiltaksdeltagelse from '../vilkårsvurdering-av-tiltaksdeltagelse/VilkårsvurderingAvTiltaksdeltagelse';
import { AndreYtelser } from '../../steg/AndreYtelser';
import VilkårsvurderingAvStønadsdager from '../vilkårsvurdering-av-stønadsdager/VilkårsvurderingAvStønadsdager';
import KVPogIntro from '../../steg/KVPogIntro';
import Søknadstidspunkt from '../../steg/Søknadstidspunkt';
import Institusjonsopphold from '../../steg/Institusjonsopphold';

const BehandlingSteg = () => {
  const router = useRouter();
  const behandlingsteg = router.query.behandlingsteg as string;

  function utledStegFraRoute(route: string | undefined): ReactElement {
    switch (route) {
      case Behandlingssteg.ALDER:
        return <Alder />;
      case Behandlingssteg.SØKNADSTIDSPUNKT:
        return <Søknadstidspunkt />;
      case Behandlingssteg.TILTAKSDELTAGELSE:
        return <VilkårsvurderingAvTiltaksdeltagelse />;
      case Behandlingssteg.KVPINTRO:
        return <KVPogIntro />;
      case Behandlingssteg.INSTITUSJONSOPPHOLD:
        return <Institusjonsopphold />;
      case Behandlingssteg.ANDREYTELSER:
        return <AndreYtelser />;
      case Behandlingssteg.STØNADSDAGER:
        return <VilkårsvurderingAvStønadsdager />;
      default:
        return <Alder />;
    }
  }

  return (
    <VStack className={styles.behandlingsteg}>
      {utledStegFraRoute(behandlingsteg)}
    </VStack>
  );
};

export default BehandlingSteg;
