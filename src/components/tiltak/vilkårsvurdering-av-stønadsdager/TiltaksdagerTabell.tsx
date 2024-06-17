import React, { useRef } from 'react';
import { Button, Table } from '@navikt/ds-react';
import styles from './TiltaksdagerTabell.module.css';
import { formatPeriode } from '../../../utils/date';
import { Stønadsdager } from '../../../types/Behandling';

interface StønadsdagerTabellProps {
  stønadsdager: Stønadsdager[];
}

function renderAntallDagerSaksopplysningRad({
  periode,
  antallDager,
  kilde,
}: Stønadsdager) {
  const formattertPeriode = formatPeriode(periode);
  return (
    <Table.Row key={formattertPeriode}>
      <Table.DataCell>{formattertPeriode}</Table.DataCell>
      <Table.DataCell>{antallDager}</Table.DataCell>
      <Table.DataCell>{kilde}</Table.DataCell>
    </Table.Row>
  );
}

const TiltaksdagerTabell = ({ stønadsdager }: StønadsdagerTabellProps) => {
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
          {stønadsdager.map((stø) => renderAntallDagerSaksopplysningRad(stø))}
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
      {/*<EndreAntallDagerModal*/}
      {/*  ref={ref}*/}
      {/*  minDate={dayjs(periode.fra).toDate()}*/}
      {/*  maxDate={dayjs(periode.til).toDate()}*/}
      {/*  tiltakId={props.tiltak.id}*/}
      {/*/>*/}
    </div>
  );
};

export default TiltaksdagerTabell;
