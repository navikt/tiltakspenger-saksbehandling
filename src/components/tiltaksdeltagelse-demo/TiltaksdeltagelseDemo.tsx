import React from 'react';
import {
  BodyShort,
  Button,
  Heading,
  List,
  Select,
  Table,
} from '@navikt/ds-react';
import styles from './TiltaksdeltagelseDemo.module.css';
import { Periode } from '../../types/Periode';
import { formatPeriode } from '../../utils/date';
import { PencilIcon } from '@navikt/aksel-icons';
import Periodevelger from '../saksopplysning-tabell/PeriodeVelger';

const TiltaksdeltagelseDemo = () => {
  return (
    <div className={styles.tiltaksdeltagelse}>
      <Heading size="large">Visning av tiltaksdeltagelse</Heading>
      <div className={styles.tiltakCardWrapper}>
        <TiltakCard
          tittel="Tiltakstype - Testarrangør"
          periode={{ fra: '2026-01-01', til: '2026-05-01' }}
          status="Gjennomføres"
          deltagelser={[
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
          ]}
        />
      </div>
    </div>
  );
};

interface Tiltaksdeltagelse {
  periode: Periode;
  antallDagerIUken: number;
  status: String;
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
          <Table size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                <Table.HeaderCell scope="col">
                  Antall dager per uke
                </Table.HeaderCell>
                <Table.HeaderCell scope="col">Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {deltagelser.map(({ periode, antallDagerIUken, status }) => {
                const formattertPeriode = formatPeriode(periode);
                return (
                  <Table.Row key={formattertPeriode}>
                    <Table.DataCell>{formattertPeriode}</Table.DataCell>
                    <Table.DataCell>{antallDagerIUken}</Table.DataCell>
                    <Table.DataCell>{status}</Table.DataCell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
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
          <form>
            <fieldset className={styles.tiltakCard__form__fieldset}>
              <Periodevelger
                onFromChange={() => console.log('from')}
                onToChange={() => console.log('til')}
                size="small"
              />
              <Select
                label="Antall dager"
                className={styles.tiltakCard__form__antallDagerSelectBox}
                size="small"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </Select>
            </fieldset>
            <div className={styles.tiltakCard__form__buttonSection}>
              <Button size="small" type="button">
                Lagre
              </Button>
              <Button
                variant="tertiary"
                size="small"
                type="reset"
                onClick={() => setEditMode(false)}
              >
                Avbryt
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TiltaksdeltagelseDemo;
