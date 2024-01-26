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
              text={`Søknadsdato: ${formatDate(søknadsdato)}`}
              iconRenderer={() => <FileTextIcon />}
            />
          </BodyShort>
          {deltakelseFom && (
            <BodyShort size="small">
              <IkonMedTekst
                text={`${formatDate(deltakelseFom)}${
                  !!deltakelseTom ? ` - ${formatDate(deltakelseTom)}` : ''
                }`}
                iconRenderer={() => <CalendarIcon />}
              />
            </BodyShort>
          )}
          <BodyShort size="small">
            <IkonMedTekst
              text={`${tiltakstype} - ${
                arrangoernavn ? ` - ${arrangoernavn}` : ''
              }`}
              iconRenderer={() => <Buldings3Icon />}
            />
          </BodyShort>
          <BodyShort size="small">
            <IkonMedTekst
              text={`x dager i uken `}
              iconRenderer={() => <ArrowsSquarepathIcon />}
            />
          </BodyShort>
        </div>
      </div>
    </>
  );
};

export default SøknadDetaljer;
