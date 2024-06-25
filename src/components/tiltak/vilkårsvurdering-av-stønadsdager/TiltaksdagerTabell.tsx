import React, { useRef } from 'react';
import { Button, Loader, Table } from '@navikt/ds-react';
import styles from './TiltaksdagerTabell.module.css';
import {
  periodeTilFormatertDatotekst,
  tekstTilDate,
} from '../../../utils/date';
import {
  Stønadsdager,
  StønadsdagerSaksopplysning,
} from '../../../types/Behandling';
import EndreAntallDagerModal from './EndreAntallDagerModal';
import { useHentBehandling } from '../../../hooks/useHentBehandling';
import { useRouter } from 'next/router';

interface StønadsdagerTabellProps {
  stønadsdager: StønadsdagerSaksopplysning;
}

function renderAntallDagerSaksopplysningRad({
  periode,
  antallDager,
  kilde,
}: Stønadsdager) {
  const formattertPeriode = periodeTilFormatertDatotekst(periode);
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
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) return <Loader />;

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
          {stønadsdager.avklartAntallDager.map((stø) =>
            renderAntallDagerSaksopplysningRad(stø),
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
        minDate={new Date(valgtBehandling.vurderingsperiode.fra)}
        maxDate={new Date(valgtBehandling.vurderingsperiode.til)}
        tiltakId={stønadsdager.tiltakId}
      />
    </div>
  );
};

export default TiltaksdagerTabell;
