import React from 'react';
import { Heading } from '@navikt/ds-react';
import SøknadDetails from '../søknad-details/SøknadDetails';
import RegistrertTiltakDetails from '../registrert-tiltak-details/RegistrertTiltakDetails';
import { Behandling } from '../../types/Behandling';
import styles from './SøknadSummarySection.module.css';

interface SøknadSummarySectionProps {
    søknadResponse: Behandling;
}

const SøknadSummarySection = ({ søknadResponse: { søknad, registrerteTiltak } }: SøknadSummarySectionProps) => {
    return (
        <div className={styles.søknadSummarySection}>
            <SøknadDetails søknad={søknad} />
            {registrerteTiltak && registrerteTiltak.length > 0 && (
                <div className={styles.registrerteTiltakSection}>
                    <Heading className={styles.registrerteTiltakHeading} size="xsmall" level="2">
                        Registrerte tiltak
                    </Heading>
                    {registrerteTiltak.map((registrertTiltak, index) => {
                        return <RegistrertTiltakDetails key={index} registrertTiltak={registrertTiltak} />;
                    })}
                </div>
            )}
        </div>
    );
};

export default SøknadSummarySection;
