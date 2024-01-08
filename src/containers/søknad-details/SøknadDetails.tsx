import React from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';
import {
  CalendarIcon,
  FileTextIcon,
  Buldings3Icon,
  ArrowsSquarepathIcon,
} from '@navikt/aksel-icons';
import IkonMedTekst from '../../components/ikon-med-tekst/IkonMedTekst';
import { formatDate } from '../../utils/date';
import styles from './SøknadDetails.module.css';
import Søknad from '../../types/Søknad';

interface SøknadDetailsProps {
  søknad: Søknad;
}

const SøknadDetails = ({
  søknad: {
    søknadsdato,
    deltakelseFom,
    deltakelseTom,
    arrangoernavn,
    tiltakstype,
  },
}: SøknadDetailsProps) => {
  return (
    <>
      <Heading size="xsmall" level="1" className={styles.oppsummeringHeading}>
        Oppsummering
      </Heading>
      <div className={styles.søknadSummarySection}>
        <Heading className={styles.søknadHeading} size="xsmall" level="2">
          {' '}
          Søknad{' '}
        </Heading>
        <div className={styles.søknadDetails}>
          <BodyShort size="small">
            <IkonMedTekst
              iconRenderer={() => <FileTextIcon />}
              text={`Søknadsdato: ${formatDate(søknadsdato)}`}
            />
          </BodyShort>
          {deltakelseFom && (
            <BodyShort size="small">
              <IkonMedTekst
                iconRenderer={() => <CalendarIcon />}
                text={`${formatDate(deltakelseFom)}${
                  !!deltakelseTom ? ` - ${formatDate(deltakelseTom)}` : ''
                }`}
              />
            </BodyShort>
          )}
          <BodyShort size="small">
            <IkonMedTekst
              iconRenderer={() => <Buldings3Icon />}
              text={`${tiltakstype} - ${
                arrangoernavn ? ` - ${arrangoernavn}` : ''
              }`}
            />
          </BodyShort>
          <BodyShort size="small">
            <IkonMedTekst
              iconRenderer={() => <ArrowsSquarepathIcon />}
              text={`x dager i uken `}
            />
          </BodyShort>
        </div>
      </div>
    </>
  );
};

export default SøknadDetails;
