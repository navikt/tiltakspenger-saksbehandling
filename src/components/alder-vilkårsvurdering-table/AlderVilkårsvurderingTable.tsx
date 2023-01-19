import React from 'react';
import { Table } from '@navikt/ds-react';
import { formatDate, formatÅpenPeriode } from '../../utils/date';
import AlderVilkårsvurdering from '../../types/AlderVilkårsvurdering';
import { Utfall } from '../../types/Utfall';
import VedtakUtfallText from '../vedtak-utfall-text/VedtakUtfallText';

interface AlderVilkårsvurderingTableProps {
    alderVilkårsvurderinger: AlderVilkårsvurdering;
    fødselsdato: string;
}

const AlderVilkårsvurderingTable = ({ alderVilkårsvurderinger, fødselsdato }: AlderVilkårsvurderingTableProps) => {
    const { perioder } = alderVilkårsvurderinger;
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Alder</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell>Fødselsdato</Table.HeaderCell>
                    <Table.HeaderCell>Kilde</Table.HeaderCell>
                    <Table.HeaderCell>Detaljer</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {perioder.map(({ utfall, kilde, detaljer, periode }, index) => (
                    <Table.Row key={`${utfall}${index}`}>
                        <Table.DataCell>
                            <VedtakUtfallText
                                utfall={utfall}
                                getUtfallText={(utfall) => {
                                    switch (utfall) {
                                        case Utfall.Oppfylt:
                                            return 'Bruker har fylt 18 år';
                                        case Utfall.IkkeOppfylt:
                                            return 'Bruker har ikke fylt 18 år';
                                        default:
                                            return '';
                                    }
                                }}
                            />
                        </Table.DataCell>
                        <Table.DataCell>{formatÅpenPeriode(periode)}</Table.DataCell>
                        <Table.DataCell>{formatDate(fødselsdato)}</Table.DataCell>
                        <Table.DataCell>{kilde}</Table.DataCell>
                        <Table.DataCell>{detaljer}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default AlderVilkårsvurderingTable;
