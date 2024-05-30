import React, { useRef } from 'react';
import { Button, Table } from '@navikt/ds-react';
import { AntallDagerSaksopplysning } from '../../types/Søknad';
import { formatPeriode } from '../../utils/date';
import styles from './TiltaksdagerTabell.module.css';
import EndreAntallDagerModal from './EndreAntallDagerModal';
import { Periode } from '../../types/Periode';
import dayjs from 'dayjs';

interface TiltaksdagerTabellProps {
  antallDagerSaksopplysninger: AntallDagerSaksopplysning[];
  tiltaksperiode: Periode;
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
  const { antallDagerSaksopplysninger, tiltaksperiode } = props;
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
          {antallDagerSaksopplysninger.map(renderAntallDagerSaksopplysningRad)}
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
        minDate={dayjs(tiltaksperiode.fra).toDate()}
        maxDate={dayjs(tiltaksperiode.til).toDate()}
      />
    </div>
  );
};

export default TiltaksdagerTabell;
