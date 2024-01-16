import { CardIcon } from '@navikt/aksel-icons';
import { Detail, Heading, Label } from '@navikt/ds-react';
import React from 'react';
import Divider from '../../components/divider/Divider';
import styles from './meldekortliste.module.css';
import { useMeldekortListe } from '../../core/useMeldekortListe';
import { parseDateTimestamp, getWeekNumber } from '../../utils/date';
import { MeldekortUtenDager } from '../../types/MeldekortTypes';

interface MeldekortmenyProps {
  behandlingId: string;
}

const meldekortUkeNummer = (fom: Date, tom: Date): string => {
  return `Uke ${getWeekNumber(fom)} / ${getWeekNumber(tom)}`;
};

const meldekortPeriode = (fom: Date, tom: Date): string => {
  return `${parseDateTimestamp(fom)} - ${parseDateTimestamp(tom)}`;
};

export const MeldekortMeny = ({ behandlingId }: MeldekortmenyProps) => {
  const { meldekortliste, fantGrunnlag } = useMeldekortListe(behandlingId);

  return (
    <div className={styles.MeldekortListeSection}>
      <Heading size="xsmall" level="1" className={styles.meldekortListeHeading}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <CardIcon />
          Meldekort
        </span>
      </Heading>
      <Divider />
      <div style={{ margin: '0.2rem 1rem' }}>
        {!fantGrunnlag &&
          meldekortliste?.map(
            (meldekortUtenDager: MeldekortUtenDager, index) => {
              return (
                <>
                  <div style={{ marginLeft: '1rem', padding: '0.3rem' }}>
                    <Label size="small">
                      {meldekortUkeNummer(
                        meldekortUtenDager.fom,
                        meldekortUtenDager.tom
                      )}
                    </Label>
                    <Detail>
                      {meldekortPeriode(
                        meldekortUtenDager.fom,
                        meldekortUtenDager.tom
                      )}
                    </Detail>
                  </div>
                  <Divider />
                </>
              );
            }
          )}
      </div>
    </div>
  );
};
