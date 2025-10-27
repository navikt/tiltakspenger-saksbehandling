import { Box, Table } from '@navikt/ds-react';
import React from 'react';
import { formaterDatotekst, ukedagFraDatotekst } from '~/utils/date';
import { MeldekortDagBeregnetProps } from '~/types/meldekort/MeldekortBehandling';
import { meldekortBehandlingDagStatusTekst } from '~/utils/tekstformateringUtils';
import { ikonForMeldekortBehandlingDagStatus } from '../MeldekortIkoner';
import { formatterBeløp } from '~/utils/beløp';
import { MeldekortUkeBehandling } from './MeldekortUkeBehandling';

import styles from './MeldekortUke.module.css';

type Props = {
    dager: MeldekortDagBeregnetProps[];
    ukeIndex: 0 | 1;
    underBehandling: boolean;
};

export const MeldekortUke = ({ dager, ukeIndex, underBehandling }: Props) => {
    return (
        <Box className={styles.uke}>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>{'Dag'}</Table.HeaderCell>
                        <Table.HeaderCell>{'Dato'}</Table.HeaderCell>
                        <Table.HeaderCell colSpan={2}>{'Status'}</Table.HeaderCell>
                        <Table.HeaderCell>{'Sats'}</Table.HeaderCell>
                        <Table.HeaderCell>{'Beløp'}</Table.HeaderCell>
                        <Table.HeaderCell>{'Barn'}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {underBehandling ? (
                        <MeldekortUkeBehandling dager={dager} ukeIndex={ukeIndex} />
                    ) : (
                        dager.map((dag) => (
                            <Table.Row key={dag.dato}>
                                <Table.DataCell>{ukedagFraDatotekst(dag.dato)}</Table.DataCell>
                                <Table.DataCell>{formaterDatotekst(dag.dato)}</Table.DataCell>
                                <Table.DataCell className={styles.ikon}>
                                    {ikonForMeldekortBehandlingDagStatus[dag.status]}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {meldekortBehandlingDagStatusTekst[dag.status]}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {dag.beregningsdag && `${dag.beregningsdag.prosent}%`}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {dag.beregningsdag && formatterBeløp(dag.beregningsdag.beløp)}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {dag.beregningsdag &&
                                        formatterBeløp(dag.beregningsdag.barnetillegg)}
                                </Table.DataCell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table>
        </Box>
    );
};
