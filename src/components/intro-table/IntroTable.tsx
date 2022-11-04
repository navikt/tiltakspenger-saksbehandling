import React from 'react';
import { Table } from '@navikt/ds-react';
import { ErrorColored, SuccessColored, InformationColored } from '@navikt/ds-icons';
import styles from './IntroTable.module.css';
import IconWithText from '../icon-with-text/IconWithText';
import { Vilkårsvurdering } from '../../types/Søknad';
import { formatPeriode, formatÅpenPeriode } from '../../utils/date';

interface IntroTableProps {
    vilkårsvurderinger: Vilkårsvurdering[];
}

function renderIcon(utfall: string) {
    if (utfall === 'Oppfylt') return <SuccessColored />;
    if (utfall === 'IkkeOppfylt') return <ErrorColored />;
    return <InformationColored />;
}

const IntroTable = ({ vilkårsvurderinger }: IntroTableProps) => {
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
                            <IconWithText iconRenderer={() => renderIcon(utfall)} text={utfall} />
                        </Table.DataCell>
                        <Table.DataCell>{kilde}</Table.DataCell>
                        <Table.DataCell>{detaljer}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default IntroTable;
