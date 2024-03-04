import React from 'react';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { formatDate } from '../../utils/date';
import styles from './SøknadDetaljer.module.css';
import Søknad from '../../types/Søknad';

interface SøknadDetaljerProps {
  søknad: Søknad;
}

const SøknadDetaljer = ({
  søknad: {
    søknadsdato,
    deltakelseFom,
    deltakelseTom,
    arrangoernavn,
    tiltakstype,
  },
}: SøknadDetaljerProps) => {
  return (
    <VStack gap="3">
      <Heading className={styles.søknadHeading} size="xsmall" level="4">
        Søknad
      </Heading>
      <BodyShort size="small">Søknadsdato: {formatDate(søknadsdato)}</BodyShort>

      {deltakelseFom && (
        <BodyShort size="small">
          {`${formatDate(deltakelseFom)}${
            !!deltakelseTom ? ` - ${formatDate(deltakelseTom)}` : ''
          }`}
        </BodyShort>
      )}
      <BodyShort size="small">
        {`${tiltakstype} - ${arrangoernavn ? ` - ${arrangoernavn}` : ''}`}
      </BodyShort>
      <BodyShort size="small">x dager i uken</BodyShort>
    </VStack>
  );
};

export default SøknadDetaljer;
