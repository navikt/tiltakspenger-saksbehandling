import { VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { Vilkår } from '../../types/Vilkår';
import Alder from '../steg/Alder';
import styles from './Vilkårsteg.module.css';
import Tiltaksdeltagelse from '../steg/Tiltaksdeltagelse';
import Stønadsdager from '../steg/Stønadsdager';
import Kvalifiseringsprogrammet from '../steg/Kvalifiseringsprogrammet';
import Institusjonsopphold from '../steg/Institusjonsopphold';
import Introduksjonsprogrammet from '../steg/Introduksjonsprogrammet';
import Oppsummering from '../steg/Oppsummering';
import FristForFramsettingAvKrav from '../steg/FristForFramsettingAvKrav';
import { AndreYtelser } from '../steg/AndreYtelser';

const Vilkårsteg = () => {
  const router = useRouter();
  const vilkårsteg = router.query.vilkårsteg as string;

  function utledStegFraRoute(route: string | undefined): ReactElement {
    switch (route) {
      case Vilkår.ALDER:
        return <Alder />;
      case Vilkår.KRAVFRIST:
        return <FristForFramsettingAvKrav />;
      case Vilkår.TILTAKSDELTAGELSE:
        return <Tiltaksdeltagelse />;
      case Vilkår.KVP:
        return <Kvalifiseringsprogrammet />;
      case Vilkår.INTROPROGRAMMET:
        return <Introduksjonsprogrammet />;
      case Vilkår.INSTITUSJONSOPPHOLD:
        return <Institusjonsopphold />;
      case Vilkår.ANDREYTELSER:
        return <AndreYtelser />;
      case Vilkår.STØNADSDAGER:
        return <Stønadsdager />;
      case Vilkår.OPPSUMMERING:
        return <Oppsummering />;
      default:
        return <Alder />;
    }
  }

  return (
    <VStack className={styles.behandlingsteg}>
      {utledStegFraRoute(vilkårsteg)}
    </VStack>
  );
};

export default Vilkårsteg;
