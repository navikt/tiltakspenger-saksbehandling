import React from 'react';
import { Table } from '@navikt/ds-react';
import { ErrorColored, InformationColored, SuccessColored } from '@navikt/ds-icons';
import { Institusjonsopphold } from '../../types/Søknad';
import IconWithText from '../icon-with-text/IconWithText';
import { formatÅpenPeriode } from '../../utils/date';
import { ÅpenPeriode } from '../../types/Periode';

interface InstitusjonsoppholdTableProps {
    institusjonsopphold: Institusjonsopphold;
}

function renderIcon(utfall: string) {
    if (utfall === 'Oppfylt') return <SuccessColored />;
    if (utfall === 'IkkeOppfylt') return <ErrorColored />;
    return <InformationColored />;
}

const InstitusjonsoppholdTable = ({ institusjonsopphold }: InstitusjonsoppholdTableProps) => {
    const { vilkårsvurderinger } = institusjonsopphold;
    return (
        <div>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Registrering</Table.HeaderCell>
                        <Table.HeaderCell>Ytelse</Table.HeaderCell>
                        <Table.HeaderCell>Periode</Table.HeaderCell>
                        <Table.HeaderCell>Kilde</Table.HeaderCell>
                        <Table.HeaderCell>Detaljer</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {vilkårsvurderinger.map(({ utfall, kilde, detaljer, ytelse, tittel, periode }, index) => (
                        <Table.Row key={`${utfall}${index}`}>
                            <Table.DataCell>
                                <IconWithText iconRenderer={() => renderIcon(utfall)} text={utfall} />
                            </Table.DataCell>
                            <Table.DataCell>{tittel}</Table.DataCell>
                            <Table.DataCell>{periode ? formatÅpenPeriode(periode as ÅpenPeriode) : '-'}</Table.DataCell>
                            <Table.DataCell>{kilde}</Table.DataCell>
                            <Table.DataCell>{detaljer}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

export default InstitusjonsoppholdTable;
