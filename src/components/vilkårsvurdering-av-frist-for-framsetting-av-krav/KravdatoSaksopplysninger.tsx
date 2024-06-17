import React from 'react';
import { Button, Heading, VStack } from '@navikt/ds-react';
import { formatDate } from '../../utils/date';
import { KravdatoSaksopplysning } from '../../types/Behandling';
import styles from './KravdatoSaksopplysninger.module.css';

interface KravdatoSaksopplysningerProps {
  kravdatoSaksopplysning: KravdatoSaksopplysning;
  visTilbakestillKnapp: boolean;
}

const KravdatoSaksopplysninger = ({
  kravdatoSaksopplysning,
  visTilbakestillKnapp,
}: KravdatoSaksopplysningerProps) => {
  return (
    <div className={styles.kravdatoSaksopplysninger__container}>
      <Heading size="small">Fra søknad</Heading>
      <VStack gap="1" className={styles.kravdatoSaksopplysninger__dataGrid}>
        <span>Kravdato:</span>
        <span>{formatDate(kravdatoSaksopplysning.verdi)}</span>
        <span>Kilde:</span>
        <span>Søknad</span>
      </VStack>
      {visTilbakestillKnapp && (
        <Button
          className={styles.kravdatoSaksopplysninger__tilbakestillKnapp}
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

export default KravdatoSaksopplysninger;
