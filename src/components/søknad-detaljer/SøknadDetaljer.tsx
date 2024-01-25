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
    <>
      <Heading size="xsmall" level="1" className={styles.oppsummeringHeading}>
        Oppsummering
      </Heading>
      <div className={styles.søknadOppsummering}>
        <Heading className={styles.søknadHeading} size="xsmall" level="2">
          Søknad
        </Heading>
        <div className={styles.søknadDetaljer}>
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

export default SøknadDetaljer;
