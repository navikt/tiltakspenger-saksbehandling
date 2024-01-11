import React from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';
import {
  CalendarIcon,
  FileTextIcon,
  Buldings3Icon,
  ArrowsSquarepathIcon,
} from '@navikt/aksel-icons';
import IconWithText from '../../components/icon-with-text/IconWithText';
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
            <IconWithText
              iconRenderer={() => <FileTextIcon />}
              text={`Søknadsdato: ${formatDate(søknadsdato)}`}
            />
          </BodyShort>
          {deltakelseFom && (
            <BodyShort size="small">
              <IconWithText
                iconRenderer={() => <CalendarIcon />}
                text={`${formatDate(deltakelseFom)}${
                  !!deltakelseTom ? ` - ${formatDate(deltakelseTom)}` : ''
                }`}
              />
            </BodyShort>
          )}
          <BodyShort size="small">
            <IconWithText
              iconRenderer={() => <Buldings3Icon />}
              text={`${tiltakstype} - ${
                arrangoernavn ? ` - ${arrangoernavn}` : ''
              }`}
            />
          </BodyShort>
          <BodyShort size="small">
            <IconWithText
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
