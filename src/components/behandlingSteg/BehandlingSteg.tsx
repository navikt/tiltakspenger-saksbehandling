import { VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { Behandlingssteg } from '../../types/Behandlingssteg';
import Alder from '../steg/Alder';
import styles from './BehandlingSteg.module.css';
import { AndreYtelser } from '../steg/AndreYtelser';
import Søknadstidspunkt from '../steg/Søknadstidspunkt';
import Tiltaksdeltagelse from '../steg/Tiltaksdeltagelse';
import Stønadsdager from '../steg/Stønadsdager';
import Kvalifiseringsprogrammet from '../steg/Kvalifiseringsprogrammet';
import Institusjonsopphold from '../steg/Institusjonsopphold';
import Introduksjonsprogrammet from '../steg/Introduksjonsprogrammet';
import Oppsummering from '../steg/Oppsummering';

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
        return <Tiltaksdeltagelse />;
      case Behandlingssteg.KVP:
        return <Kvalifiseringsprogrammet />;
      case Behandlingssteg.INTROPROGRAMMET:
        return <Introduksjonsprogrammet />;
      case Behandlingssteg.INSTITUSJONSOPPHOLD:
        return <Institusjonsopphold />;
      case Behandlingssteg.ANDREYTELSER:
        return <AndreYtelser />;
      case Behandlingssteg.STØNADSDAGER:
        return <Stønadsdager />;
      case Behandlingssteg.OPPSUMMERING:
        return <Oppsummering />;
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
