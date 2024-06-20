import React from 'react';
import styles from './TiltakMedAntallDager.module.css';
import TiltaksdagerTabell from './TiltaksdagerTabell';
import TiltaksdataFraRegister from './TiltaksdataFraRegister';
import { StønadsdagerSaksopplysning } from '../../../types/Behandling';

interface TiltakMedAntallDagerProps {
  stønadsdagerSaksopplysning: StønadsdagerSaksopplysning;
}

const TiltakMedAntallDager = ({
  stønadsdagerSaksopplysning,
}: TiltakMedAntallDagerProps) => {
  return (
    <div className={styles.tiltakMedAntallDager}>
      <TiltaksdagerTabell
        stønadsdager={stønadsdagerSaksopplysning}
      />
      <div className={styles.verticalLine}></div>
      <TiltaksdataFraRegister
        antallDagerSaksopplysning={stønadsdagerSaksopplysning}
      />
    </div>
  );
};

export default TiltakMedAntallDager;
