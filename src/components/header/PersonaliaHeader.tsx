import React from 'react';
import { Tag } from '@navikt/ds-react';
import { PersonCircleIcon } from '@navikt/aksel-icons';
import styles from './PersonaliaHeader.module.css';
import { Personopplysninger } from '../../types/Behandling';

interface PersonaliaHeaderProps {
  personopplysninger: Personopplysninger;
}

const PersonaliaHeader = ({ personopplysninger }: PersonaliaHeaderProps) => {
  const { fornavn, etternavn, ident, skjerming, strengtFortrolig, fortrolig } =
    personopplysninger;
  return (
    <div className={styles.personaliaHeader}>
      <PersonCircleIcon className={styles.personIcon} />
      <span data-testid="nav-personalia-header-name" className={styles.name}>
        {fornavn} {etternavn}
      </span>
      <span data-testid="nav-personalia-header-ident" className={styles.ident}>
        {ident}
      </span>
      {strengtFortrolig && (
        <Tag variant="error" className={styles.skjermingTag}>
          Søker har strengt fortrolig adresse
        </Tag>
      )}
      {fortrolig && (
        <Tag variant="error" className={styles.skjermingTag}>
          Søker har fortrolig adresse
        </Tag>
      )}
      {skjerming && (
        <Tag variant="error" className={styles.skjermingTag}>
          Søker er skjermet
        </Tag>
      )}
      <Tag variant="info-filled" size="medium" className={styles.behandlingTag}>
        Førstegangsbehandling
      </Tag>
    </div>
  );
};

export default PersonaliaHeader;
