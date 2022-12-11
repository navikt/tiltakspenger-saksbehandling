import React from 'react';
import { Table } from '@navikt/ds-react';
import { formatÅpenPeriode } from '../../utils/date';
import { ÅpenPeriode } from '../../types/Periode';
import UtfallIcon from '../utfall-icon/UtfallIcon';
import IconWithText from '../icon-with-text/IconWithText';
import createVurderingText from '../../utils/vurderingText';
import TiltakspengerYtelser from '../../types/TiltakspengerYtelser';

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
                {perioder.map((vilkårsvurdering, index) => {
                    const { utfall, kilde, periode, detaljer } = vilkårsvurdering;
                    return (
                        <Table.Row key={`${utfall}${index}`}>
                            <Table.DataCell>
                                <IconWithText
                                    iconRenderer={() => <UtfallIcon utfall={utfall} />}
                                    text={createVurderingText(vilkårsvurdering, 'Tiltakspenger')}
                                />
                            </Table.DataCell>
                            <Table.DataCell>{periode ? formatÅpenPeriode(periode as ÅpenPeriode) : '-'}</Table.DataCell>
                            <Table.DataCell>{kilde}</Table.DataCell>
                            <Table.DataCell>{detaljer}</Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};

export default TiltakspengerYtelserTable;
