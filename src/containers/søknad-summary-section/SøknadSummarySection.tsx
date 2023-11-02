import React from 'react';
import SøknadDetails from '../søknad-details/SøknadDetails';
import styles from './SøknadSummarySection.module.css';
import Søknad from '../../types/Søknad';

interface SøknadSummarySectionProps {
    søknad: Søknad;
}

const SøknadSummarySection = ({ søknad }: SøknadSummarySectionProps) => {
    return (
        <div className={styles.søknadSummarySection}>
            <SøknadDetails søknad={søknad} />
            {/* {registrerteTiltak && registrerteTiltak.length > 0 && (
                <div className={styles.registrerteTiltakSection}>
                    <Heading className={styles.registrerteTiltakHeading} size="xsmall" level="2">
                        Registrerte tiltak
                    </Heading>
                    {registrerteTiltak.map((registrertTiltak, index) => {
                        return <RegistrertTiltakDetails key={index} registrertTiltak={registrertTiltak} />;
                    })}
                </div> 
            )}
            */}
        </div>
    );
};

export default SøknadSummarySection;
