import React from 'react';
import { Table, Tag } from '@navikt/ds-react';
import { Barnetillegg } from '../../types/Søknad';
import { formatDateShort } from '../../utils/date';

interface BarnetilleggTableProps {
    barnetillegg: Barnetillegg[];
}

const BarnetilleggTable = ({ barnetillegg }: BarnetilleggTableProps) => {
    const visFortroligAdresseTag = (fortrolig: Boolean, strengtFortrolig: Boolean) => {
        if (strengtFortrolig) return <Tag variant="error">Har strengt fortrolig adresse</Tag>;
        if (fortrolig) return <Tag variant="error">Har strengt fortrolig adresse</Tag>;
        return '-';
    };

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Søkt</Table.HeaderCell>
                    <Table.HeaderCell>Navn</Table.HeaderCell>
                    <Table.HeaderCell>Bosatt i Norge</Table.HeaderCell>
                    <Table.HeaderCell>Fødselsdato</Table.HeaderCell>
                    <Table.HeaderCell>Alder</Table.HeaderCell>
                    <Table.HeaderCell>Kilde</Table.HeaderCell>
                    <Table.HeaderCell>Detaljer</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {barnetillegg.map(
                    (
                        {
                            utfall,
                            søktBarnetillegg,
                            fødselsdato,
                            navn,
                            alder,
                            bosatt,
                            kilde,
                            fortrolig,
                            strengtFortrolig,
                        },
                        index
                    ) => (
                        <Table.Row key={`${navn}${index}`}>
                            <Table.DataCell>{søktBarnetillegg ? 'Ja' : 'Nei'}</Table.DataCell>
                            <Table.DataCell>{navn || 'Skjult'}</Table.DataCell>
                            <Table.DataCell>{bosatt === 'NOR' ? 'Ja' : 'Nei'}</Table.DataCell>
                            <Table.DataCell>{formatDateShort(fødselsdato)}</Table.DataCell>
                            <Table.DataCell>{alder}</Table.DataCell>
                            <Table.DataCell>{kilde}</Table.DataCell>
                            <Table.DataCell>{visFortroligAdresseTag(fortrolig, strengtFortrolig)}</Table.DataCell>
                        </Table.Row>
                    )
                )}
            </Table.Body>
        </Table>
    );
};

export default BarnetilleggTable;
