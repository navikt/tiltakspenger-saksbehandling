import { BodyShort, Box, Heading, HStack, Table } from '@navikt/ds-react';
import React from 'react';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../utils/date';
import styles from './Meldekort.module.css';
import { MeldekortDag } from '../../../types/MeldekortTypes';
import { finnMeldekortdagStatusTekst } from '../../../utils/tekstformateringUtils';
import { velgIkonForMeldekortStatus } from './Meldekortikoner';

interface UtbetalingsukeProps {
  utbetalingUke: MeldekortDag[];
  headingtekst: string;
}

export const Utbetalingsuke = ({
  utbetalingUke,
  headingtekst,
}: UtbetalingsukeProps) => (
  <Box className={styles.utbetalingsuke}>
    <Heading size="small" level="3">
      {headingtekst}
    </Heading>
    <Table size="small">
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
              <HStack align="center" gap="3" wrap={false}>
                {velgIkonForMeldekortStatus(dag.status)}
                {finnMeldekortdagStatusTekst(dag.status)}
              </HStack>
            </Table.DataCell>
            <Table.DataCell>
              {dag.beregningsdag ? `${dag.beregningsdag.prosent}%` : '-'}
            </Table.DataCell>
            <Table.DataCell>
              {dag.beregningsdag ? `${dag.beregningsdag.beløp},-` : '-'}
            </Table.DataCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Box>
);
