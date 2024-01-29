import styles from './Saksdialog.module.css';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Heading } from '@navikt/ds-react';
import { Endring } from '../../types/Behandling';
import { SaksdialogElement } from './SaksdialogElement';

interface HistorikkProps {
  endringslogg: Endring[];
}

export const Saksdialog = ({ endringslogg }: HistorikkProps) => {
  return (
    <div className={styles.historikkColumn}>
      <Heading size="xsmall" level="1" className={styles.historikkHeading}>
        <span className={styles.historikkHeadingSpan}>
          <ChevronRightIcon /> &nbsp; Saksdialog{' '}
        </span>
      </Heading>
      {endringslogg.map((endring, index) => (
        <SaksdialogElement endring={endring} key={index} />
      ))}
    </div>
  );
};
