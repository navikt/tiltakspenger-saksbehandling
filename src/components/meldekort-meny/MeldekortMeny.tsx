import { CardIcon } from '@navikt/aksel-icons';
import { Detail, Heading, Label } from '@navikt/ds-react';
import React from 'react';
import styles from './meldekortmeny.module.css';
import { useHentMeldekortListe } from '../../hooks/useHentMeldekortListe';
import { getWeekNumber, formatPeriode } from '../../utils/date';
import { MeldekortUtenDager } from '../../types/MeldekortTypes';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';

interface MeldekortmenyProps {
  behandlingId: string;
}

const meldekortUkeNummer = (fom: Date, tom: Date): string => {
  return `Uke ${getWeekNumber(fom)} / ${getWeekNumber(tom)}`;
};

export const MeldekortMeny = ({ behandlingId }: MeldekortmenyProps) => {
  const { meldekortliste } = useHentMeldekortListe(behandlingId);

  return (
    <div className={styles.MeldekortListeSection}>
      <Heading size="xsmall" level="1" className={styles.meldekortListeHeading}>
        <IkonMedTekst text={'Meldekort'} iconRenderer={() => <CardIcon />} />
      </Heading>
      <div style={{ margin: '0.2rem 1rem' }}>
        {meldekortliste?.map((meldekortUtenDager: MeldekortUtenDager) => {
          return (
            <div
              key={meldekortUtenDager.id}
              style={{ marginLeft: '1rem', padding: '0.3rem' }}
            >
              <Label size="small">
                {meldekortUkeNummer(
                  meldekortUtenDager.fom,
                  meldekortUtenDager.tom
                )}
              </Label>
              <Detail>
                {formatPeriode({
                  fra: meldekortUtenDager.fom.toString(),
                  til: meldekortUtenDager.tom.toString(),
                })}
              </Detail>
            </div>
          );
        })}
      </div>
    </div>
  );
};
