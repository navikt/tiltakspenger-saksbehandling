import { Box, Table } from '@navikt/ds-react';
import React from 'react';
import {
  UtbetalingsDagDTO,
  UtbetalingsDagStatus,
} from '../../../types/UtbetalingTypes';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../utils/date';
import styles from './Utbetaling.module.css';

interface UtbetalingsukeProps {
  utbetalingUke: UtbetalingsDagDTO[];
}

function hentProsentUtbetaling(status: UtbetalingsDagStatus) {
  switch (status) {
    case UtbetalingsDagStatus.FullUtbetaling:
      return '100 %';
    case UtbetalingsDagStatus.DelvisUtbetaling:
      return '75 %';
    case UtbetalingsDagStatus.IngenUtbetaling:
      return '-';
  }
}

export const Utbetalingsuke = ({ utbetalingUke }: UtbetalingsukeProps) => {
  return (
    <Box className={styles.utbetalingsuke}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Dag</Table.HeaderCell>
            <Table.HeaderCell>Dato</Table.HeaderCell>
            <Table.HeaderCell>Gradering</Table.HeaderCell>
            <Table.HeaderCell>Beløp</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {utbetalingUke.map((dag) => (
            <Table.Row key={dag.dato.toString()}>
              <Table.DataCell>{ukedagFraDatotekst(dag.dato)}</Table.DataCell>
              <Table.DataCell>{formaterDatotekst(dag.dato)}</Table.DataCell>
              <Table.DataCell>
                {hentProsentUtbetaling(dag.status)}
              </Table.DataCell>
              <Table.DataCell>{dag.beløp},-</Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};
