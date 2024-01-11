import React from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';
import { RegistrertTiltak } from '../../types/Søknad';
import { formatDate, formatPeriode } from '../../utils/date';
import { Periode, ÅpenPeriode } from '../../types/Periode';
import Tiltaksstatus from '../../components/tiltaksstatus/Tiltaksstatus';
import styles from './RegistrertTiltakDetails.module.css';

interface RegistrertTiltakDetailsProps {
  registrertTiltak: RegistrertTiltak;
}

function formatDagerIUken(dager: number) {
  if (dager === 1) {
    return '1 dag';
  }
  return `${dager} dager`;
}

function renderPeriode(periode?: ÅpenPeriode) {
  if (!periode) {
    return '-';
  }
  if (!!periode.til) {
    return formatPeriode(periode as Periode);
  }
  return formatDate(periode.fra);
}

const RegistrertTiltakDetails = ({
  registrertTiltak,
}: RegistrertTiltakDetailsProps) => {
  const { arrangør, periode, prosent, status, navn, dagerIUken } =
    registrertTiltak;
  return (
    <div className={styles.registrertTiltakDetails}>
      <BodyShort
        size="small"
        className={styles.registrertTiltakDetails__field}
        spacing
      >
        {' '}
        {`Variant: ${navn}`}{' '}
      </BodyShort>
      <BodyShort
        size="small"
        className={styles.registrertTiltakDetails__field}
        spacing
      >
        {' '}
        {`Arrangør: ${arrangør}`}
      </BodyShort>
      <BodyShort
        size="small"
        className={styles.registrertTiltakDetails__field}
        spacing
      >
        {renderPeriode(periode)}
      </BodyShort>
      <BodyShort
        size="small"
        className={styles.registrertTiltakDetails__field}
        spacing
      >
        {prosent}%{!!dagerIUken ? ` - ${formatDagerIUken(dagerIUken)}` : ''}
      </BodyShort>
      <div style={{ marginTop: '1rem' }}>
        <Tiltaksstatus tiltaksstatus={status} />
      </div>
    </div>
  );
};

export default RegistrertTiltakDetails;
