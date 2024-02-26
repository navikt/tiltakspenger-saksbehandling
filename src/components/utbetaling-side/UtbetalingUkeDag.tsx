import {Detail, HGrid} from '@navikt/ds-react';
import React from 'react';
import {UtbetalingsDagDTO, UtbetalingsDagStatus} from "../../types/Utbetaling";
import {formatDate, getDayOfWeek} from "../../utils/date";
import styles from "./Utbetaling.module.css";

interface UtbetalingUkeProps {
  utbetalingUke: UtbetalingsDagDTO[];
}

function hentProsentUtbetaling(status: UtbetalingsDagStatus) {
   switch(status) {
      case UtbetalingsDagStatus.FullUtbetaling:
         return '100 %';
      case UtbetalingsDagStatus.DelvisUtbetaling:
         return '75 %';
      case UtbetalingsDagStatus.IngenUtbetaling:
         return '-';
   }
}

export const UtbetalingUkeDag = ({
  utbetalingUke,
}: UtbetalingUkeProps) => {
  return (
      <div className={styles.utbetalingDagliste}>
          {utbetalingUke.map((dag, i) => {
              return (
                  <div key={i} className={styles.utbetalingDagListeGrid}>
                      <HGrid gap="12" columns={4}>
                        <Detail truncate>{getDayOfWeek(dag.dato)}</Detail>
                        <Detail truncate>{formatDate(dag.dato.toString())}</Detail>
                        <Detail truncate>{hentProsentUtbetaling(dag.status)}</Detail>
                        <Detail truncate>{dag.beløp}</Detail>
                      </HGrid>
                  </div>
              )
          })}
      </div>
  );
};
