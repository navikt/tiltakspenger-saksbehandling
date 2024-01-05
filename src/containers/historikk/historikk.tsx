import styles from './historikk.module.css';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import React from 'react';
import { Heading } from '@navikt/ds-react';

export const Historikk = () => {
  return (
    <div className={styles.historikkColumn}>
      <Heading size="xsmall" level="1" className={styles.historikkHeading}>
        <span className={styles.historikkHeadingSpan}>
          <ChevronRightIcon /> &nbsp; Historikk{' '}
        </span>
      </Heading>
    </div>
  );
};
