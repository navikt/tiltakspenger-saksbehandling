import { VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { Behandlingssteg } from '../../types/Behandlingssteg';
import Alder from '../../steg/Alder';
import styles from './BehandlingSteg.module.css';
import VilkårsvurderingAvTiltaksdeltagelse from '../vilkårsvurdering-av-tiltaksdeltagelse/VilkårsvurderingAvTiltaksdeltagelse';
import { Utfall } from '../../types/Utfall';
import Tiltaksstatus from '../../types/Tiltaksstatus';

const BehandlingSteg = () => {
  const router = useRouter();
  const behandlingsteg = router.query.behandlingsteg as string;

  function utledStegFraRoute(route: string | undefined): ReactElement {
    switch (route) {
      case Behandlingssteg.ALDER:
        return <p>Aldersteg</p>;
      case Behandlingssteg.SØKNADSTIDSPUNKT:
        return <p>Søknadstidspunkt</p>;
      case Behandlingssteg.TILTAKSDELTAGELSE:
        return (
          <VilkårsvurderingAvTiltaksdeltagelse
            registrerteTiltak={[
              {
                arrangør: 'hei',
                dagerIUken: 3,
                navn: 'heisann',
                periode: {
                  fra: '01.01.2024',
                  til: '01.05.2024',
                },
                prosent: 100,
                status: Tiltaksstatus.AKTUELL,
                girRett: true,
                harSøkt: true,
                kilde: 'komet',
                deltagelseUtfall: Utfall.OPPFYLT,
                begrunnelse: 'Det er oppfyllt',
              },
            ]}
          />
        );
      default:
        return <Alder />;
    }
  }

  console.log(behandlingsteg);
  return (
    <VStack className={styles.behandlingsteg}>
      {utledStegFraRoute(behandlingsteg)}
    </VStack>
  );
};

export default BehandlingSteg;
