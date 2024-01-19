import React from 'react';
import SøknadDetails from '../søknad-details/SøknadDetails';
import styles from './SøknadSummarySection.module.css';
import Søknad, { RegistrertTiltak } from '../../types/Søknad';
import RegistrertTiltakDetaljer from '../registrert-tiltak-detaljer/RegistrertTiltakDetaljer';
import { Heading } from '@navikt/ds-react';

interface SøknadSummarySectionProps {
  søknad: Søknad;
  registrerteTiltak: RegistrertTiltak[];
}

const SøknadSummarySection = ({
  søknad,
  registrerteTiltak,
}: SøknadSummarySectionProps) => {
  return (
    <div className={styles.søknadSummarySection}>
      <SøknadDetails søknad={søknad} />
      {registrerteTiltak && registrerteTiltak.length > 0 && (
        <div className={styles.registrerteTiltakSection}>
          <Heading
            className={styles.registrerteTiltakHeading}
            size="xsmall"
            level="2"
          >
            Registrerte tiltak
          </Heading>
          {registrerteTiltak.map((registrertTiltak, index) => {
            return (
              <RegistrertTiltakDetaljer
                key={index}
                registrertTiltak={registrertTiltak}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SøknadSummarySection;
