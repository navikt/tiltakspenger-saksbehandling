import React from 'react';
import { Table } from '@navikt/ds-react';
import { ErrorColored, SuccessColored, InformationColored } from '@navikt/ds-icons';
import IconWithText from '../icon-with-text/IconWithText';
import { Vilkårsvurdering } from '../../types/Søknad';
import { formatPeriode, formatÅpenPeriode } from '../../utils/date';

// interface StatligYtelseVedtak {
//     vedtak: 'Ja' | 'Nei';
//     ytelse: string;
//     periode: string;
//     kilde: string;
//     detaljer: string;
// }

interface StatligeYtelserTableProps {
    vilkårsvurderinger: Vilkårsvurdering[];
}

function renderIcon(utfall: string) {
    if (utfall === 'Oppfylt') return <SuccessColored />;
    if (utfall === 'IkkeOppfylt') return <ErrorColored />;
    return <InformationColored />;
}

const StatligeYtelserTable = ({ vilkårsvurderinger }: StatligeYtelserTableProps) => {
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
                {vilkårsvurderinger.map(({ utfall, ytelse, periode, kilde, detaljer }, index) => (
                    <Table.Row key={`${utfall}${index}`}>
                        <Table.DataCell>
                            <IconWithText iconRenderer={() => renderIcon(utfall)} text={utfall} />
                        </Table.DataCell>
                        <Table.DataCell>{ytelse}</Table.DataCell>
                        <Table.DataCell>{(periode && formatÅpenPeriode(periode)) || '-'}</Table.DataCell>
                        <Table.DataCell>{kilde}</Table.DataCell>
                        <Table.DataCell>{detaljer}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default StatligeYtelserTable;
