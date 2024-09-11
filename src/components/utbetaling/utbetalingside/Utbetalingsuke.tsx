import { Box, Table } from '@navikt/ds-react';
import React from 'react';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../utils/date';
import styles from './Utbetaling.module.css';
import { MeldekortDag } from '../../../types/MeldekortTypes';
import { finnMeldekortdagStatusTekst } from '../../../utils/tekstformateringUtils';

interface UtbetalingsukeProps {
  utbetalingUke: MeldekortDag[];
}

export const Utbetalingsuke = ({ utbetalingUke }: UtbetalingsukeProps) => (
  <Box className={styles.utbetalingsuke}>
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Dag</Table.HeaderCell>
          <Table.HeaderCell>Dato</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
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
              {finnMeldekortdagStatusTekst(dag.status)}
            </Table.DataCell>
            <Table.DataCell>{`${dag.beregningsdag.prosent}%`}</Table.DataCell>
            <Table.DataCell>
              {dag.beregningsdag.beløp}
              ,-
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Box>
);
