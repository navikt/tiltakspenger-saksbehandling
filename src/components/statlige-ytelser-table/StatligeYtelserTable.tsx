import React from 'react';
import { Table } from '@navikt/ds-react';
import { ErrorColored, SuccessColored } from '@navikt/ds-icons';
import IconWithText from '../icon-with-text/IconWithText';

interface StatligYtelseVedtak {
    vedtak: 'Ja' | 'Nei';
    ytelse: string;
    periode: string;
    kilde: string;
    detaljer: string;
}

interface StatligeYtelserTableProps {
    rows: StatligYtelseVedtak[];
}

const StatligeYtelserTable = ({ rows }: StatligeYtelserTableProps) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Vedtak</Table.HeaderCell>
                    <Table.HeaderCell>Ytelse</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell>Kilde</Table.HeaderCell>
                    <Table.HeaderCell>Detaljer</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {rows.map(({ vedtak, ytelse, periode, kilde, detaljer }) => (
                    <Table.Row>
                        <Table.DataCell>
                            <IconWithText
                                iconRenderer={() => (vedtak === 'Ja' ? <SuccessColored /> : <ErrorColored />)}
                                text={vedtak}
                            />
                        </Table.DataCell>
                        <Table.DataCell>{ytelse}</Table.DataCell>
                        <Table.DataCell>{periode}</Table.DataCell>
                        <Table.DataCell>{kilde}</Table.DataCell>
                        <Table.DataCell>{detaljer}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default StatligeYtelserTable;
