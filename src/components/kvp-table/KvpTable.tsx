import React from 'react';
import { Table } from '@navikt/ds-react';
import { Vilkårsvurdering } from '../../types/Søknad';
import VedtakUtfallText from '../vedtak-utfall-text/VedtakUtfallText';
import styles from './KvpTable.module.css';

interface KvpTableProps {
    vilkårsvurderinger: Vilkårsvurdering[];
}

const KvpTable = ({ vilkårsvurderinger }: KvpTableProps) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Registrering</Table.HeaderCell>
                    <Table.HeaderCell>Kilde</Table.HeaderCell>
                    <Table.HeaderCell>Detaljer</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vilkårsvurderinger.map(({ utfall, kilde, detaljer }, index) => (
                    <Table.Row key={`${utfall}${index}`}>
                        <Table.DataCell className={styles.registreringCell}>
                            <VedtakUtfallText utfall={utfall} />
                        </Table.DataCell>
                        <Table.DataCell>{kilde}</Table.DataCell>
                        <Table.DataCell>{detaljer}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default KvpTable;
