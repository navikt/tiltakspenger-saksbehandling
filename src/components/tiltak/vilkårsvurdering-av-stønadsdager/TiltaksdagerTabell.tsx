import React, { useRef } from 'react';
import { Button, Table } from '@navikt/ds-react';
import styles from './TiltaksdagerTabell.module.css';
import EndreAntallDagerModal from './EndreAntallDagerModal';
import dayjs from 'dayjs';
import {
  AntallDagerSaksopplysning,
  RegistrertTiltak,
} from '../../../types/Søknad';
import { formatPeriode } from '../../../utils/date';

interface TiltaksdagerTabellProps {
  tiltak: RegistrertTiltak;
}

function renderAntallDagerSaksopplysningRad({
  periode,
  antallDager,
  kilde,
}: AntallDagerSaksopplysning) {
  const formattertPeriode = formatPeriode(periode);
  return (
    <Table.Row key={formattertPeriode}>
      <Table.DataCell>{formattertPeriode}</Table.DataCell>
      <Table.DataCell>{antallDager}</Table.DataCell>
      <Table.DataCell>{kilde}</Table.DataCell>
    </Table.Row>
  );
}

const TiltaksdagerTabell = (props: TiltaksdagerTabellProps) => {
  const { antallDagerSaksopplysninger, periode } = props.tiltak;
  const ref = useRef(null);
  return (
    <div className={styles.tiltaksdagerTabell__container}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell>Antall dager per uke</Table.HeaderCell>
            <Table.HeaderCell>Kilde</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {antallDagerSaksopplysninger.avklartAntallDager.map(
            renderAntallDagerSaksopplysningRad,
          )}
        </Table.Body>
      </Table>
      <Button
        className={styles.tiltaksdagerTabell__endreKnapp}
        variant="secondary"
        type="button"
        size="small"
        onClick={() => (ref as any).current?.showModal()}
      >
        Endre antall dager per uke
      </Button>
      <EndreAntallDagerModal
        ref={ref}
        minDate={dayjs(periode.fra).toDate()}
        maxDate={dayjs(periode.til).toDate()}
        tiltakId={props.tiltak.id}
      />
    </div>
  );
};

export default TiltaksdagerTabell;
