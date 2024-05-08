import React from 'react';
import { Heading } from '@navikt/ds-react';
import styles from './TiltaksdeltagelseDemo.module.css';
import TiltakCard from './TiltakCard';
import { TiltaksdeltagelseDTO } from './types';
import { formatPeriode } from '../../utils/date';
import TiltaksdeltagelseVilkårsvurdering from '../tiltaksdeltagelse-vilkårsvurdering/TiltaksdeltagelseVilkårsvurdering';
import { Utfall } from '../../types/Utfall';

interface TiltaksdeltagelseDemoProps {
  tiltaksdeltagelser: TiltaksdeltagelseDTO[];
}

const TiltaksdeltagelseDemo = ({
  tiltaksdeltagelser,
}: TiltaksdeltagelseDemoProps) => {
  return (
    <div className={styles.tiltaksdeltagelse}>
      <Heading size="large">Visning av tiltaksdeltagelse</Heading>
      <TiltaksdeltagelseVilkårsvurdering
        samletUtfall={Utfall.OPPFYLT}
        tiltaksdeltagelser={tiltaksdeltagelser}
      />
      <div className={styles.tiltakCardWrapper}>
        {tiltaksdeltagelser.map((tiltaksdeltagelse) => {
          return (
            <TiltakCard
              tittel={tiltaksdeltagelse.tiltaksvariant}
              periode={tiltaksdeltagelse.periode}
              status={tiltaksdeltagelse.status}
              harSøkt={tiltaksdeltagelse.harSøkt}
              girRett={tiltaksdeltagelse.girRett}
              deltagelsesperioder={tiltaksdeltagelse.deltagelsesperioder}
              onAddTiltaksdeltagelse={() => {}}
              key={formatPeriode(tiltaksdeltagelse.periode)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TiltaksdeltagelseDemo;
