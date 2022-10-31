import React from 'react';
import { Heading } from '@navikt/ds-react';
import IconWithText from '../icon-with-text/IconWithText';
import { Calender, FileContent, Office1, Refresh } from '@navikt/ds-icons';
import { formatDate } from '../../utils/date';
import Søknad from '../../types/Søknad';
import styles from './SøknadDetails.module.css';

interface SøknadDetailsProps {
    søknad: Søknad;
}

const SøknadDetails = ({
    søknad: { søknadsdato, startdato, sluttdato, arrangoernavn, antallDager },
}: SøknadDetailsProps) => {
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
                    text={`${antallDager} dager i uka`}
                />
            </div>
        </div>
    );
};

export default SøknadDetails;
