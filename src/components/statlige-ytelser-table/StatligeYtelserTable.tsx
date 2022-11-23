import React from 'react';
import { Table } from '@navikt/ds-react';
import { Vilkårsvurdering } from '../../types/Søknad';
import { formatÅpenPeriode } from '../../utils/date';
import readableTextsByYtelse from '../../constants/readableTextsByYtelse';
import { Utfall } from '../../types/Utfall';
import UtfallIcon from '../utfall-icon/UtfallIcon';
import IconWithText from '../icon-with-text/IconWithText';
import { Ytelse } from '../../types/Ytelse';
import styles from './StatligeYtelserTable.module.css';

interface StatligeYtelserTableProps {
    vilkårsvurderinger: Vilkårsvurdering[];
}

function createYtelseText(ytelse: Ytelse, utfall: Utfall) {
    if (Utfall.Oppfylt === utfall) {
        return `Bruker er ikke innvilget ${readableTextsByYtelse[ytelse]}`;
    }
    if (Utfall.IkkeOppfylt) {
        return `Bruker er innvilget ${readableTextsByYtelse[ytelse]}`;
    }
    return readableTextsByYtelse[ytelse];
}

const StatligeYtelserTable = ({ vilkårsvurderinger }: StatligeYtelserTableProps) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Ytelse</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell>Kilde</Table.HeaderCell>
                    <Table.HeaderCell>Detaljer</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vilkårsvurderinger.map(({ utfall, ytelse, periode, kilde, detaljer }, index) => (
                    <Table.Row
                        className={utfall === Utfall.IkkeImplementert ? styles.missingStatusRow : ''}
                        key={`${utfall}${index}`}
                    >
                        <Table.DataCell>
                            <IconWithText
                                iconRenderer={() => <UtfallIcon utfall={utfall} />}
                                text={createYtelseText(ytelse, utfall)}
                            />
                        </Table.DataCell>
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
