import React from 'react';
import { Button, Heading, VStack } from '@navikt/ds-react';
import styles from './TiltaksdataFraRegister.module.css';
import {
  AntallDagerSaksopplysninger,
  RegistrertTiltak,
} from '../../types/Søknad';

interface TiltaksdataFraRegisterProps {
  tiltak: RegistrertTiltak;
}

function utledAntallDagerFraRegister({
  antallDagerSaksopplysningerFraRegister,
}: AntallDagerSaksopplysninger) {
  if (
    !antallDagerSaksopplysningerFraRegister ||
    antallDagerSaksopplysningerFraRegister.length === 0
  ) {
    return 'Mangler data fra register';
  }
  const [antallDagerSaksopplysning] = antallDagerSaksopplysningerFraRegister;
  return antallDagerSaksopplysning.antallDager;
}

const TiltaksdataFraRegister = ({
  tiltak: { navn, kilde, arrangør, antallDagerSaksopplysninger },
}: TiltaksdataFraRegisterProps) => {
  const antallDager = utledAntallDagerFraRegister(antallDagerSaksopplysninger);
  return (
    <div className={styles.tiltaksdataFraRegister__container}>
      <Heading size="small">Registerdata</Heading>
      <VStack gap="1" className={styles.tiltaksdataFraRegister__dataGrid}>
        <span>Tiltaksvariant:</span>
        <span>{navn}</span>
        <span>Arrangør:</span>
        <span>{arrangør}</span>
        <span>Antall dager per uke:</span>
        <span>{antallDager}</span>
        <span>Kilde:</span>
        <span>{kilde}</span>
      </VStack>
      <Button
        className={styles.tiltaksdataFraRegister__tilbakestillKnapp}
        variant="secondary"
        type="button"
        size="small"
        onClick={() => {}}
      >
        Tilbakestill til registerdata
      </Button>
    </div>
  );
};

export default TiltaksdataFraRegister;
