import React from 'react';
import styles from './TiltaksdeltagelseDemo.module.css';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { dateToISO, formatPeriode } from '../../utils/date';
import { PencilIcon } from '@navikt/aksel-icons';
import { Periode } from '../../types/Periode';
import { Tiltaksdeltagelse } from './types';
import TiltaksdeltagelseTable from './TiltaksdeltagelseTable';
import TiltaksdeltagelseForm from './TiltaksdeltagelseForm';

interface TiltakCardProps {
  tittel: string;
  periode: Periode;
  status: string;
  deltagelser: Tiltaksdeltagelse[];
  onAddTiltaksdeltagelse: (nyTiltaksdeltagelse: Tiltaksdeltagelse) => void;
}

const TiltakCard = ({
  tittel,
  periode,
  status,
  deltagelser,
  onAddTiltaksdeltagelse,
}: TiltakCardProps) => {
  const [editMode, setEditMode] = React.useState(false);
  return (
    <div style={{ maxWidth: '800px' }}>
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
          <TiltaksdeltagelseTable deltagelser={deltagelser} />
        </div>
        <Button
          icon={<PencilIcon title="Rediger" />}
          variant={'tertiary'}
          className={styles.tiltakCard__iconButton}
          type="button"
          onClick={() => setEditMode(!editMode)}
        />
      </div>
      {editMode && (
        <div className={styles.tiltakCard__form}>
          <TiltaksdeltagelseForm
            onSubmit={(data) => {
              onAddTiltaksdeltagelse({
                periode: {
                  fra: dateToISO(data.periode.fom),
                  til: dateToISO(data.periode.tom),
                },
                antallDagerIUken: +data.antallDagerIUken,
                // TODO: Hvordan sette denne?
                status: 'Gjennomføres',
              });
              setEditMode(false);
            }}
            onCancel={() => {
              setEditMode(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TiltakCard;
