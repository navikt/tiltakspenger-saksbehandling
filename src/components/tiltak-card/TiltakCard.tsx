import React from 'react';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { dateToISO, formatPeriode } from '../../utils/date';
import { PencilIcon } from '@navikt/aksel-icons';
import { Periode } from '../../types/Periode';
import TiltaksdeltagelseTable from '../tiltaksdeltagelse-table/TiltaksdeltagelseTable';
import TiltaksdeltagelseForm from '../tiltaksdeltagelse-form/TiltaksdeltagelseForm';
import { Deltagelsesperiode } from '../../types/Deltagelsesperiode';
import styles from './TiltakCard.module.css';

interface TiltakCardProps {
  tittel: string;
  periode: Periode;
  status: string;
  deltagelsesperioder: Deltagelsesperiode[];
  harSøkt: boolean;
  girRett: boolean;
  onAddTiltaksdeltagelse: (nyTiltaksdeltagelse: Deltagelsesperiode) => void;
}

const TiltakCard = ({
  tittel,
  periode,
  status,
  harSøkt,
  girRett,
  deltagelsesperioder,
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
          <BodyShort>
            <b>Har søkt: </b>
            {harSøkt ? 'Ja' : 'Nei'}
          </BodyShort>
          <BodyShort>
            <b>Gir rett: </b>
            {girRett ? 'Ja' : 'Nei'}
          </BodyShort>
        </div>
        <div className={styles.tiltakCard__deltagelseSection}>
          <TiltaksdeltagelseTable deltagelsesperioder={deltagelsesperioder} />
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
                antallDager: +data.antallDagerIUken,
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
