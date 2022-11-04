import React from 'react';
import { Table } from '@navikt/ds-react';
import { ErrorColored, SuccessColored, InformationColored } from '@navikt/ds-icons';
import styles from './IntroTable.module.css';
import IconWithText from '../icon-with-text/IconWithText';
import { Vilkårsvurdering } from '../../types/Søknad';
import { formatDate, formatPeriode, formatÅpenPeriode } from '../../utils/date';
import { Periode, ÅpenPeriode } from '../../types/Periode';

interface IntroTableProps {
    vilkårsvurderinger: Vilkårsvurdering[];
}

function renderIcon(utfall: string) {
    if (utfall === 'Oppfylt') return <SuccessColored />;
    if (utfall === 'IkkeOppfylt') return <ErrorColored />;
    return <InformationColored />;
}

function renderPeriode(periode?: ÅpenPeriode) {
    if (!periode) {
        return '-';
    }
    if (!!periode.til) {
        return formatPeriode(periode as Periode);
    }
    return formatDate(periode.fra);
}

const IntroTable = ({ vilkårsvurderinger }: IntroTableProps) => {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Registrering</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell>Kilde</Table.HeaderCell>
                    <Table.HeaderCell>Detaljer</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {vilkårsvurderinger.map(({ utfall, kilde, detaljer, periode }, index) => (
                    <Table.Row key={`${utfall}${index}`}>
                        <Table.DataCell className={styles.registreringCell}>
                            <IconWithText iconRenderer={() => renderIcon(utfall)} text={utfall} />
                        </Table.DataCell>
                        <Table.HeaderCell>{renderPeriode(periode)}</Table.HeaderCell>
                        <Table.DataCell>{kilde}</Table.DataCell>
                        <Table.DataCell>{detaljer}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

export default IntroTable;
