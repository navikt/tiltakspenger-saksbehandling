import { Box, Heading, HStack, Table } from '@navikt/ds-react';
import React from 'react';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../utils/date';
import { MeldekortBehandlingDagBeregnet } from '../../../types/meldekort/MeldekortBehandling';
import { meldekortBehandlingDagStatusTekst } from '../../../utils/tekstformateringUtils';
import { ikonForMeldekortBehandlingDagStatus } from './Meldekortikoner';

import styles from './Meldekort.module.css';

interface UtbetalingsukeProps {
    utbetalingUke: MeldekortBehandlingDagBeregnet[];
    headingtekst: string;
}

export const Utbetalingsuke = ({ utbetalingUke, headingtekst }: UtbetalingsukeProps) => (
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
                    <Table.HeaderCell>Sats</Table.HeaderCell>
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
                                {ikonForMeldekortBehandlingDagStatus[dag.status]}
                                {meldekortBehandlingDagStatusTekst[dag.status]}
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
