import React from 'react';
import { Tag } from '@navikt/ds-react';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import styles from './PersonaliaHeader.module.css';
import { Personopplysninger } from '../../types/Behandling';
import { Lesevisning } from '../../utils/avklarLesevisning';

interface PersonaliaHeaderProps {
  personopplysninger: Personopplysninger;
  lesevisning: Lesevisning;
}

const PersonaliaHeader = ({
  personopplysninger,
  lesevisning,
}: PersonaliaHeaderProps) => {
  const { fornavn, etternavn, ident, skjerming, strengtFortrolig, fortrolig } =
    personopplysninger;
  return (
    <div className={styles.personaliaHeader}>
      <PersonCircleIcon className={styles.personaliaHeader__personIcon} />
      <span
        data-testid="nav-personalia-header-name"
        className={styles.personaliaHeader__name}
      >
        {fornavn} {etternavn}
      </span>
      <span
        data-testid="nav-personalia-header-ident"
        className={styles.personaliaHeader__ident}
      >
        {ident}
      </span>
      {strengtFortrolig && (
        <Tag variant="error" className={styles.personaliaHeader__tag}>
          Søker har strengt fortrolig adresse
        </Tag>
      )}
      {fortrolig && (
        <Tag variant="error" className={styles.personaliaHeader__tag}>
          Søker har fortrolig adresse
        </Tag>
      )}
      {skjerming && (
        <Tag variant="error" className={styles.personaliaHeader__tag}>
          Søker er skjermet
        </Tag>
      )}
      {!lesevisning.kanEndre && (
        <Tag variant="neutral" className={styles.personaliaHeader__lesevisning}>
          Lesevisning - Saksopplysninger kan ikke endres
        </Tag>
      )}
    </div>
  );
};

export default PersonaliaHeader;
