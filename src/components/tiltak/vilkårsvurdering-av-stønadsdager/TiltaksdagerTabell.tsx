import React, { useRef } from 'react';
import { Button, Table } from '@navikt/ds-react';
import styles from './TiltaksdagerTabell.module.css';
import { formatDateShort, formatPeriode } from '../../../utils/date';
import { Stønadsdager, StønadsdagerSaksopplysning } from '../../../types/Behandling';
import EndreAntallDagerModal from './EndreAntallDagerModal';
import { useHentBehandling } from '../../../hooks/useHentBehandling';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

interface StønadsdagerTabellProps {
  stønadsdager: StønadsdagerSaksopplysning;
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
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);  return (
  
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
          {stønadsdager.avklartAntallDager.map((stø) => renderAntallDagerSaksopplysningRad(stø))}
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
       minDate={dayjs(valgtBehandling?.vurderingsperiode.fra).toDate()}
       maxDate={dayjs(valgtBehandling?.vurderingsperiode.til).toDate()}
      tiltakId={stønadsdager.tiltakId}
      />
    </div>
  );
};

export default TiltaksdagerTabell;
