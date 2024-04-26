import React from 'react';
import { Heading } from '@navikt/ds-react';
import styles from './TiltaksdeltagelseDemo.module.css';
import TiltakCard from './TiltakCard';
import { Tiltaksdeltagelse } from './types';

const tiltaksdeltagelserDefault: Tiltaksdeltagelse[] = [
  {
    periode: { fra: '2026-01-01', til: '2026-01-31' },
    antallDagerIUken: 5,
    status: 'Gjennomføres',
  },
  {
    periode: { fra: '2026-02-01', til: '2026-05-01' },
    antallDagerIUken: 3,
    status: 'Gjennomføres',
  },
];

const TiltaksdeltagelseDemo = () => {
  const [tiltaksdeltagelser, setTiltaksdeltagelser] = React.useState(
    tiltaksdeltagelserDefault,
  );

  return (
    <div className={styles.tiltaksdeltagelse}>
      <Heading size="large">Visning av tiltaksdeltagelse</Heading>
      <div className={styles.tiltakCardWrapper}>
        <TiltakCard
          tittel="Tiltakstype - Testarrangør"
          periode={{ fra: '2026-01-01', til: '2026-05-01' }}
          status="Gjennomføres"
          deltagelser={tiltaksdeltagelser}
          onAddTiltaksdeltagelse={(nyTiltaksdeltagelse) => {
            setTiltaksdeltagelser([...tiltaksdeltagelser, nyTiltaksdeltagelse]);
          }}
        />
      </div>
    </div>
  );
};

export default TiltaksdeltagelseDemo;
