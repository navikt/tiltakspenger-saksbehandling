import React from 'react';
import { Table } from '@navikt/ds-react';
import { Vilkårsvurdering } from '../../types/Søknad';
import { formatÅpenPeriode } from '../../utils/date';
import VedtakUtfallText from '../vedtak-utfall-text/VedtakUtfallText';

interface StatligeYtelserTableProps {
    vilkårsvurderinger: Vilkårsvurdering[];
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
                            <VedtakUtfallText utfall={utfall} />
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
