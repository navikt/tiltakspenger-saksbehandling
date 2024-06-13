import { VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { Behandlingssteg } from '../../types/Behandlingssteg';
import Alder from '../steg/Alder';
import styles from './BehandlingSteg.module.css';
import { AndreYtelser } from '../steg/AndreYtelser';
import Søknadstidspunkt from '../steg/Søknadstidspunkt';
import VilkårsvurderingAvTiltaksdeltagelse from '../tiltak/vilkårsvurdering-av-tiltaksdeltagelse/VilkårsvurderingAvTiltaksdeltagelse';
import VilkårsvurderingAvStønadsdager from '../tiltak/vilkårsvurdering-av-stønadsdager/VilkårsvurderingAvStønadsdager';

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
        return <p>KVPINTRO</p>;
      case Behandlingssteg.INSTITUSJONSOPPHOLD:
        return <p>Institusjonsopphold</p>;
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
