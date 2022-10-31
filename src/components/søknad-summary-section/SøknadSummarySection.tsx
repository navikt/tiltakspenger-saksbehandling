import React from 'react';
import { Heading } from '@navikt/ds-react';
import { Calender, FileContent, Office1, Refresh } from '@navikt/ds-icons';
import Søknad from '../../types/Søknad';
import styles from './SøknadSummarySection.module.css';
import IconWithText from '../icon-with-text/IconWithText';
import { formatDate } from '../../utils/date';

interface SøknadSummarySectionProps {
    søknad: Søknad;
}

const SøknadSummarySection = ({
    søknad: { søknadsdato, antallDager, startdato, sluttdato, arrangoernavn },
}: SøknadSummarySectionProps) => {
    return (
        <div className={styles.søknadSummarySection}>
            <Heading size="small" level="1">
                Oppsummering
            </Heading>
            <Heading className={styles.søknadHeading} size="xsmall" level="2">
                Søknad
            </Heading>
            <div className={styles.søknadDetails}>
                <IconWithText
                    className={styles.søknadDetail}
                    iconRenderer={() => <FileContent />}
                    text={`Søknadsdato: ${formatDate(søknadsdato)}`}
                />
                <IconWithText
                    className={styles.søknadDetail}
                    iconRenderer={() => <Calender />}
                    text={`${formatDate(startdato)} - ${formatDate(sluttdato)}`}
                />
                <IconWithText className={styles.søknadDetail} iconRenderer={() => <Office1 />} text={arrangoernavn} />
                <IconWithText
                    className={styles.søknadDetail}
                    iconRenderer={() => <Refresh />}
                    text={`${antallDager} dager i uka (${(antallDager / 5.0) * 100.0}%)`}
                />
            </div>
        </div>
    );
};

export default SøknadSummarySection;
