import React from 'react';
import { BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import { formaterDatotekst } from '../../utils/date';
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
    <div className={styles.container}>
      <Heading size="small">Fra søknad</Heading>
      <VStack gap="1" className={styles.dataGrid}>
        <BodyShort>Kravdato:</BodyShort>
        <BodyShort>
          {formaterDatotekst(kravdatoSaksopplysning.kravdato)}
        </BodyShort>
        <BodyShort>Kilde:</BodyShort>
        <BodyShort>Søknad</BodyShort>
      </VStack>
      {visTilbakestillKnapp && (
        <Button
          className={styles.tilbakestillKnapp}
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
