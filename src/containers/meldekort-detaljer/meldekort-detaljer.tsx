import styles from './detaljer.module.css';
import { Heading } from '@navikt/ds-react';
import {
  BagdeIcon,
  ChevronRightIcon,
  InformationIcon,
  PersonCircleIcon,
} from '@navikt/aksel-icons';
import DetaljeListeelement from '../../components/detalje-listeelement/IconWithLabelAndDetails';
import React from 'react';

export const Detaljer = () => {
  return (
    <div className={styles.detaljerColumn}>
      <Heading size="xsmall" level="1" className={styles.detaljerHeading}>
        <span className={styles.detaljerHeadingSpan}>
          <ChevronRightIcon /> &nbsp; Detaljer{' '}
        </span>
      </Heading>
      <DetaljeListeelement
        iconRenderer={() => <BagdeIcon />}
        label="Meldekort type"
        discription="Elektronisk"
      />
      <DetaljeListeelement
        iconRenderer={() => <InformationIcon />}
        label="Status"
        discription="Må gåes opp"
      />
      <DetaljeListeelement
        iconRenderer={() => <PersonCircleIcon />}
        label="Signatur"
        discription="Z8834556612"
      />
    </div>
  );
};
