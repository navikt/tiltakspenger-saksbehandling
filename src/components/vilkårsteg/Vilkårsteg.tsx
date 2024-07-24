import { VStack } from '@navikt/ds-react';
import router from 'next/router';
import { ReactElement } from 'react';
import { Vilkår } from '../../types/Vilkår';
import Alder from '../vilkår/Alder';
import styles from './Vilkårsteg.module.css';
import Tiltaksdeltagelse from '../vilkår/Tiltaksdeltagelse';
import Stønadsdager from '../vilkår/Stønadsdager';
import Kvalifiseringsprogrammet from '../vilkår/Kvalifiseringsprogrammet';
import Institusjonsopphold from '../vilkår/Institusjonsopphold';
import Introduksjonsprogrammet from '../vilkår/Introduksjonsprogrammet';
import FristForFramsettingAvKrav from '../vilkår/FristForFramsettingAvKrav';
import { AndreYtelser } from '../vilkår/AndreYtelser';

const Vilkårsteg = () => {
  const vilkårsteg = router.query.vilkårsteg as string;

  function utledStegFraRoute(route: string | undefined): ReactElement {
    switch (route) {
      case Vilkår.KRAVFRIST:
        return <FristForFramsettingAvKrav />;
      case Vilkår.ALDER:
        return <Alder />;
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
      default:
        return <FristForFramsettingAvKrav />;
    }
  }

  return (
    <VStack className={styles.vilkårsteg}>
      {utledStegFraRoute(vilkårsteg)}
    </VStack>
  );
};

export default Vilkårsteg;
