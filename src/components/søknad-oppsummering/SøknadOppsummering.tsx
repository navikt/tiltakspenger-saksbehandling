import React from 'react';
import SøknadDetails from '../søknad-detaljer/SøknadDetaljer';
import styles from './SøknadOppsummering.module.css';
import Søknad, { RegistrertTiltak } from '../../types/Søknad';
import RegistrertTiltakDetaljer from '../registrert-tiltak-detaljer/RegistrertTiltakDetaljer';
import { Heading } from '@navikt/ds-react';

interface SøknadOppsummeringProps {
  søknad: Søknad;
  registrerteTiltak: RegistrertTiltak[];
}

const SøknadOppsummering = ({
  søknad,
  registrerteTiltak,
}: SøknadOppsummeringProps) => {
  return (
    <div className={styles.søknadOppsummering}>
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

export default SøknadOppsummering;
