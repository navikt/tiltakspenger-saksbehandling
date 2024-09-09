import { Box, Table } from '@navikt/ds-react';
import React from 'react';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../utils/date';
import styles from './Utbetaling.module.css';
import { MeldekortDag } from '../../../types/MeldekortTypes';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import router from 'next/router';
import {
  finnMeldekortdagStatusTekst,
  hentBeløp,
  hentProsentUtbetaling,
} from '../../../utils/tekstformateringUtils';

interface UtbetalingsukeProps {
  utbetalingUke: MeldekortDag[];
}

export const Utbetalingsuke = ({ utbetalingUke }: UtbetalingsukeProps) => {
  const sakId = router.query.sakId as string;
  const meldekortId = router.query.meldekortId as string;
  const { meldekort } = useHentMeldekort(meldekortId, sakId);

  return (
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
              <Table.DataCell>
                {hentProsentUtbetaling(dag.reduksjonAvYtelsePåGrunnAvFravær)}
              </Table.DataCell>
              <Table.DataCell>
                {hentBeløp(
                  dag.reduksjonAvYtelsePåGrunnAvFravær,
                  meldekort.sats,
                )}
                ,-
              </Table.DataCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};
