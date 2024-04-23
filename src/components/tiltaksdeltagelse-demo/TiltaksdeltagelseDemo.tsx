import React from 'react';
import { BodyShort, Button, Heading, List } from '@navikt/ds-react';
import styles from './TiltaksdeltagelseDemo.module.css';
import { Periode } from '../../types/Periode';
import { formatPeriode } from '../../utils/date';
import { PencilIcon } from '@navikt/aksel-icons';

const TiltaksdeltagelseDemo = () => {
  return (
    <div className={styles.tiltaksdeltagelse}>
      <Heading size="large">Visning av tiltaksdeltagelse</Heading>
      <div className={styles.tiltakCardWrapper}>
        <TiltakCard
          tittel="Tiltakstype - Testarrangør"
          periode={{ fra: '2026-01-01', til: '2026-01-05' }}
          status="Gjennomføres"
          deltagelser={[
            {
              periode: { fra: '2026-01-01', til: '2026-01-31' },
              antallDagerIUken: 5,
            },
            {
              periode: { fra: '2026-01-02', til: '2026-01-05' },
              antallDagerIUken: 3,
            },
          ]}
        />
      </div>
    </div>
  );
};

interface Tiltaksdeltagelse {
  periode: Periode;
  antallDagerIUken: number;
}

interface TiltakCardProps {
  tittel: string;
  periode: Periode;
  status: string;
  deltagelser: Tiltaksdeltagelse[];
}

const TiltakCard = ({
  tittel,
  periode,
  status,
  deltagelser,
}: TiltakCardProps) => {
  const [editMode, setEditMode] = React.useState(false);
  React.useEffect(() => console.log(`editMode: ${editMode}`), [editMode]);
  return (
    <div className={styles.tiltakCard}>
      <Heading size="medium">{tittel}</Heading>
      <div className={styles.tiltakCard__ingress}>
        <BodyShort>
          <b>Vurderingsperiode: </b>
          {formatPeriode(periode)}
        </BodyShort>
        <BodyShort>
          <b>Status: </b>
          {status}
        </BodyShort>
      </div>
      <div className={styles.tiltakCard__deltagelseSection}>
        <List title="Deltagelse">
          {deltagelser.map(({ periode, antallDagerIUken }) => {
            const formattertPeriode = formatPeriode(periode);
            return (
              <List.Item key={formattertPeriode}>
                {formattertPeriode} ({antallDagerIUken} dager i uken)
              </List.Item>
            );
          })}
        </List>
      </div>
      <Button
        icon={<PencilIcon title="Rediger" />}
        variant={'tertiary'}
        className={styles.tiltakCard__iconButton}
        type="button"
        onClick={() => setEditMode(!editMode)}
      />
    </div>
  );
};

export default TiltaksdeltagelseDemo;
