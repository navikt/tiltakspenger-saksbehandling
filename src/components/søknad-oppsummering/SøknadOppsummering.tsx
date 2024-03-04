import React from 'react';
import SøknadDetails from '../søknad-detaljer/SøknadDetaljer';
import styles from './SøknadOppsummering.module.css';
import Søknad, { RegistrertTiltak } from '../../types/Søknad';
import RegistrertTiltakDetaljer from '../registrert-tiltak-detaljer/RegistrertTiltakDetaljer';
import { Heading, Spacer, VStack } from '@navikt/ds-react';
import { Skuff } from '../skuff/Skuff';

interface SøknadOppsummeringProps {
  søknad: Søknad;
  registrerteTiltak: RegistrertTiltak[];
}

const SøknadOppsummering = ({
  søknad,
  registrerteTiltak,
}: SøknadOppsummeringProps) => {
  return (
    <Skuff venstreOrientert headerTekst={'Oppsummering'}>
      <div className={styles.søknadOppsummering}>
        <SøknadDetails søknad={søknad} />
        {registrerteTiltak && (
          <VStack>
            <Heading
              className={styles.registrerteTiltakHeading}
              size="xsmall"
              level="4"
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
          </VStack>
        )}
      </div>
    </Skuff>
  );
};

export default SøknadOppsummering;
