import React from 'react';
import { Table } from '@navikt/ds-react';
import { formatÅpenPeriode } from '../../utils/date';
import { ÅpenPeriode } from '../../types/Periode';
import VedtakUtfallText from '../vedtak-utfall-text/VedtakUtfallText';
import IconWithText from '../icon-with-text/IconWithText';
import { UtfallIcon } from '../utfall-icon/UtfallIcon';
import { Utfall } from '../../types/Utfall';
import Pensjonsordninger from '../../types/Pensjonsordninger';

interface PensjonsordningerTableProps {
    pensjonsordninger: Pensjonsordninger;
}

const PensjonsordningerTable = ({ pensjonsordninger }: PensjonsordningerTableProps) => {
    const { samletUtfall, perioder } = pensjonsordninger;
    if (perioder.length === 0) {
        return (
            <Table.Row key="Pensjonsordninger">
                <Table.DataCell>
                    <IconWithText iconRenderer={() => <UtfallIcon utfall={Utfall.Oppfylt} />} text="Nei" />
                </Table.DataCell>
                <Table.DataCell>-</Table.DataCell>
                <Table.DataCell>-</Table.DataCell>
                <Table.DataCell>-</Table.DataCell>
            </Table.Row>
        );
    }
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
                    {perioder.map(({ kilde, detaljer, periode, utfall }, index) => (
                        <Table.Row key={`${samletUtfall}${index}`}>
                            <Table.DataCell>
                                <VedtakUtfallText utfall={utfall} />
                            </Table.DataCell>
                            <Table.DataCell>Pensjonsordning</Table.DataCell>
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

export default PensjonsordningerTable;
