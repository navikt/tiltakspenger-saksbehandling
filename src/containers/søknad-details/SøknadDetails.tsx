import React from 'react';
import { Heading } from '@navikt/ds-react';
import { CalendarIcon, FileTextIcon, Buldings3Icon, ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import IconWithText from '../../components/icon-with-text/IconWithText';
import { formatDate } from '../../utils/date';
import styles from './SøknadDetails.module.css';
import Søknad from '../../types/Søknad';

interface SøknadDetailsProps {
    søknad: Søknad;
}

const SøknadDetails = ({
    søknad: { søknadsdato, startdato, sluttdato, arrangoernavn, tiltakstype },
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
                <IconWithText iconRenderer={() => <FileTextIcon />} text={`Søknadsdato: ${formatDate(søknadsdato)}`} />
                {startdato && (
                    <IconWithText
                        iconRenderer={() => <CalendarIcon />}
                        text={`${formatDate(startdato)}${!!sluttdato ? ` - ${formatDate(sluttdato)}` : ''}`}
                    />
                )}
                <IconWithText
                    iconRenderer={() => <Buldings3Icon />}
                    text={`${tiltakstype} - ${arrangoernavn ? ` - ${arrangoernavn}` : ''}`}
                />
            </div>
        </div>
    );
};

export default SøknadDetails;
