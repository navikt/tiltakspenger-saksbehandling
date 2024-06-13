import React from 'react';
import { Button, Heading, VStack } from '@navikt/ds-react';
import styles from './SøknadsfristSaksopplysninger.module.css';
import { formatDate } from '../../utils/date';

interface SøknadsfristSaksopplysningerProps {
  opprinneligSøknadstidspunkt: Date;
  visTilbakestillKnapp: boolean;
}

const SøknadsfristSaksopplysninger = ({
  opprinneligSøknadstidspunkt,
  visTilbakestillKnapp,
}: SøknadsfristSaksopplysningerProps) => {
  return (
    <div className={styles.søknadsfristSaksopplysninger__container}>
      <Heading size="small">Fra søknad</Heading>
      <VStack gap="1" className={styles.søknadsfristSaksopplysninger__dataGrid}>
        <span>Kravdato:</span>
        <span>{formatDate(opprinneligSøknadstidspunkt.toDateString())}</span>
        <span>Kilde:</span>
        <span>Søknad</span>
      </VStack>
      {visTilbakestillKnapp && (
        <Button
          className={styles.søknadsfristSaksopplysninger__tilbakestillKnapp}
          variant="secondary"
          type="button"
          size="small"
          onClick={async () => {
            console.log('Nullstill');
          }}
        >
          Tilbakestill kravdato
        </Button>
      )}
    </div>
  );
};

export default SøknadsfristSaksopplysninger;
