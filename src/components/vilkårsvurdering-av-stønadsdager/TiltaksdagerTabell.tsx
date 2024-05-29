import React from 'react';
import { Button, Table } from '@navikt/ds-react';
import { AntallDagerSaksopplysning } from '../../types/Søknad';
import { formatPeriode } from '../../utils/date';
import styles from './TiltaksdagerTabell.module.css';

interface TiltaksdagerTabellProps {
  antallDagerSaksopplysninger: AntallDagerSaksopplysning[];
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

const TiltaksdagerTabell = ({
  antallDagerSaksopplysninger,
}: TiltaksdagerTabellProps) => {
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
          {antallDagerSaksopplysninger.map(renderAntallDagerSaksopplysningRad)}
        </Table.Body>
      </Table>
      <Button
        className={styles.tiltaksdagerTabell__endreKnapp}
        variant="secondary"
        type="button"
        size="small"
        onClick={() => {}}
      >
        Endre antall dager per uke
      </Button>
    </div>
  );
};

export default TiltaksdagerTabell;
