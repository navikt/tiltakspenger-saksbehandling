import React from 'react';
import { Table } from '@navikt/ds-react';
import { TiltakspengerYtelser } from '../../types/Søknad';
import VedtakUtfallText from '../vedtak-utfall-text/VedtakUtfallText';
import { formatÅpenPeriode } from '../../utils/date';
import { ÅpenPeriode } from '../../types/Periode';

interface TiltakspengerYtelserTableProps {
    tiltakspengerYtelser: TiltakspengerYtelser;
}

const TiltakspengerYtelserTable = ({ tiltakspengerYtelser }: TiltakspengerYtelserTableProps) => {
    const { perioder } = tiltakspengerYtelser;
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Vedtak</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell>Kilde</Table.HeaderCell>
                    <Table.HeaderCell>Detaljer</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {perioder.map(({ kilde, detaljer, periode, utfall }, index) => (
                    <Table.Row key={`${utfall}${index}`}>
                        <Table.DataCell>
                            <VedtakUtfallText utfall={utfall} />
                        </Table.DataCell>
                        <Table.DataCell>{periode ? formatÅpenPeriode(periode as ÅpenPeriode) : '-'}</Table.DataCell>
                        <Table.DataCell>{kilde}</Table.DataCell>
                        <Table.DataCell>{detaljer}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default TiltakspengerYtelserTable;
