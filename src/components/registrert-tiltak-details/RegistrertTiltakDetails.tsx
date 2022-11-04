import React from 'react';
import { Heading } from '@navikt/ds-react';
import { SuccessColored } from '@navikt/ds-icons';
import { RegistrertTiltak } from '../../types/Søknad';
import { formatDate, formatPeriode } from '../../utils/date';
import IconWithText from '../icon-with-text/IconWithText';
import { Periode, ÅpenPeriode } from '../../types/Periode';
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

const RegistrertTiltakDetails = ({ registrertTiltak }: RegistrertTiltakDetailsProps) => {
    const { arrangør, periode, prosent, status, navn, dagerIUken } = registrertTiltak;
    return (
        <div className={styles.registrertTiltakDetails}>
            <Heading size="small" level="1">
                {navn}
            </Heading>
            <p className={styles.registrertTiltakDetails__field}>{arrangør}</p>
            <p className={styles.registrertTiltakDetails__field}>{renderPeriode(periode)}</p>
            <p className={styles.registrertTiltakDetails__field}>
                {prosent}%{!!dagerIUken ? ` - ${formatDagerIUken(dagerIUken)}` : ''}
            </p>
            <div style={{ marginTop: '1rem' }}>
                <IconWithText iconRenderer={() => <SuccessColored />} text={status} />
            </div>
        </div>
    );
};

export default RegistrertTiltakDetails;
