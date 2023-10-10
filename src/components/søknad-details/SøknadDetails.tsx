import React from 'react';
import { Heading } from '@navikt/ds-react';
import { Calender, FileContent, Office1, Refresh } from '@navikt/ds-icons';
import IconWithText from '../icon-with-text/IconWithText';
import { formatDate } from '../../utils/date';
import styles from './SøknadDetails.module.css';
import Søknad from '../../types/Søknad';

interface SøknadDetailsProps {
    søknad: Søknad;
}

const SøknadDetails = ({
    søknad: { søknadsdato, startdato, sluttdato, arrangoernavn, antallDager, tiltakstype },
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
                <IconWithText iconRenderer={() => <FileContent />} text={`Søknadsdato: ${formatDate(søknadsdato)}`} />
                {startdato && (
                    <IconWithText
                        iconRenderer={() => <Calender />}
                        text={`${formatDate(startdato)}${!!sluttdato ? ` - ${formatDate(sluttdato)}` : ''}`}
                    />
                )}
                <IconWithText
                    iconRenderer={() => <Office1 />}
                    text={`${tiltakstype} - ${arrangoernavn ? ` - ${arrangoernavn}` : ''}`}
                />
                {antallDager && <IconWithText iconRenderer={() => <Refresh />} text={`${antallDager} dager i uka`} />}
            </div>
        </div>
    );
};

export default SøknadDetails;
