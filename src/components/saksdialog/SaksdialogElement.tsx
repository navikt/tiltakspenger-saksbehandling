import styles from './Saksdialog.module.css';
import { InformationSquareFillIcon } from '@navikt/aksel-icons';
import { formaterDatotekstMedTidspunkt } from '../../utils/date';
import React from 'react';
import { Endring } from '../../types/Behandling';

interface SaksdialogElementProps {
  endring: Endring;
}
export const SaksdialogElement = ({ endring }: SaksdialogElementProps) => {
  return (
    <div className={styles.historikkRow}>
      <div>
        <InformationSquareFillIcon
          width="1.5em"
          height="1.5em"
          color="var(--a-icon-info)"
        />
      </div>
      <div className={styles.historikkContent}>
        <span className={styles.historikkType}>{endring.type}</span>
        <span className={styles.historikkTekst}>{endring.begrunnelse}</span>
        <span className={styles.historikkSignatur}>
          {`${formaterDatotekstMedTidspunkt(endring.endretTidspunkt)} - ${endring.endretAv}`}
        </span>
      </div>
    </div>
  );
};
