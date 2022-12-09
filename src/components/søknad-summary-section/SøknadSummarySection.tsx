import React from 'react';
import SøknadDetails from '../søknad-details/SøknadDetails';
import RegistrertTiltakDetails from '../registrert-tiltak-details/RegistrertTiltakDetails';
import Behandling from '../../types/Behandling';
import styles from './SøknadSummarySection.module.css';

interface SøknadSummarySectionProps {
    søknadResponse: Behandling;
}

const SøknadSummarySection = ({ søknadResponse: { søknad, registrerteTiltak } }: SøknadSummarySectionProps) => {
    return (
        <div className={styles.søknadSummarySection}>
            <SøknadDetails søknad={søknad} />
            {registrerteTiltak.map((registrertTiltak, index) => {
                return <RegistrertTiltakDetails key={index} registrertTiltak={registrertTiltak} />;
            })}
        </div>
    );
};

export default SøknadSummarySection;
