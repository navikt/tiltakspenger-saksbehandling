import React from 'react';
import { SøknadResponse } from '../../types/Søknad';
import SøknadDetails from '../søknad-details/SøknadDetails';
import RegistrertTiltakDetails from '../registrert-tiltak-details/RegistrertTiltakDetails';
import styles from './SøknadSummarySection.module.css';

interface SøknadSummarySectionProps {
    søknadResponse: SøknadResponse;
}

const SøknadSummarySection = ({ søknadResponse: { søknad, registrerteTiltak } }: SøknadSummarySectionProps) => {
    return (
        <div className={styles.søknadSummarySection}>
            <SøknadDetails søknad={søknad} />
            {registrerteTiltak.map((registrertTiltak) => {
                return <RegistrertTiltakDetails registrertTiltak={registrertTiltak} />;
            })}
        </div>
    );
};

export default SøknadSummarySection;
