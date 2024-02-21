import {Table} from '@navikt/ds-react';
import React from 'react';
import {UtbetalingsDagDTO, UtbetalingsDagStatus} from "../../types/Utbetaling";
import {formatDate, getDayOfWeek} from "../../utils/date";

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
      <>
        {utbetalingUke.map((dag, i) => {
          return (
              <Table.Row key={i} style={{padding:'0rem'}}>
                <Table.DataCell style={{margin: '1rem'}} scope="row">{getDayOfWeek(dag.dato)}</Table.DataCell>
                <Table.DataCell scope="row">{formatDate(dag.dato.toString())}</Table.DataCell>
                <Table.DataCell scope="row">{hentProsentUtbetaling(dag.status)}</Table.DataCell>
                <Table.DataCell scope="row">{dag.beløp === 0 ? '-': dag.beløp}</Table.DataCell>
              </Table.Row>
          );
        })}
      </>
  );
};
