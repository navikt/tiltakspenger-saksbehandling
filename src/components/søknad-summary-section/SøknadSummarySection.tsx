import React from 'react';
import Søknad from '../../types/Søknad';
import { Heading } from '@navikt/ds-react';
import styles from './SøknadSummarySection.module.css';

interface SøknadSummarySectionProps {
    søknad: Søknad;
}

const SøknadSummarySection = ({
    søknad: {
        prosent,
        registrertTiltak: {
            beskrivelse,
            periode: { fom, tom },
        },
        søknadsdato,
        antallDager,
    },
}: SøknadSummarySectionProps) => (
    <div className={styles.søknadSummarySection}>
        <Heading size="small" level="1">
            Oppsummering
        </Heading>
        <Heading className={styles.søknadHeading} size="xsmall" level="2">
            Søknad
        </Heading>
        <div className={styles.søknadDetails}>
            <span className={styles.søknadDetail}>Søknadsdato {søknadsdato}</span>
            <span className={styles.søknadDetail}>
                {fom} - {tom}
            </span>
            <span className={styles.søknadDetail}>{beskrivelse}</span>
            <span className={styles.søknadDetail}>
                {antallDager} dager i uka ({prosent}%)
            </span>
        </div>
    </div>
);

export default SøknadSummarySection;
