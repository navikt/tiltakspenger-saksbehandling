import { Detail, Label } from '@navikt/ds-react';
import React from 'react';
import styles from './UtbetalingMeny.module.css';
import { getWeekNumber, formatPeriode } from '../../../utils/date';
import { useRouter } from 'next/router';
import { useHentUtbetalingListe } from '../../../hooks/useHentUtbetalingListe';
import { UtbetalingListe } from '../../../types/Utbetaling';
import { Skuff } from '../../skuff/Skuff';

interface UtbetalingmenyProps {
  behandlingId: string;
}

const utbetalingUkeNummer = (fom: Date, tom: Date): string => {
  return `Uke ${getWeekNumber(fom)} / ${getWeekNumber(tom)}`;
};

export const UtbetalingMeny = ({ behandlingId }: UtbetalingmenyProps) => {
  const { utbetalingListe } = useHentUtbetalingListe(behandlingId);
  const router = useRouter();

  return (
    <Skuff venstreOrientert headerTekst="Utbetalinger">
      <div className={styles.utbetalingliste}>
        {utbetalingListe?.map((utbetaling: UtbetalingListe) => {
          return (
            <div
              key={utbetaling.id}
              className={styles.listeelement}
              onClick={() =>
                router.push(
                  `/behandling/${behandlingId}/utbetaling/${utbetaling.id}`,
                )
              }
            >
              <Label size="small">
                {utbetalingUkeNummer(utbetaling.fom, utbetaling.tom)}
              </Label>
              <Detail>
                {formatPeriode({
                  fra: utbetaling.fom.toString(),
                  til: utbetaling.tom.toString(),
                })}
              </Detail>
              <Detail>Utbetalt: {utbetaling.beløp.toString()}</Detail>
            </div>
          );
        })}
      </div>
    </Skuff>
  );
};
