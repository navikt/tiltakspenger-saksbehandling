import React from 'react';
import { Table } from '@navikt/ds-react';
import { InformationIcon } from '@navikt/aksel-icons';
import IconWithText from '../icon-with-text/IconWithText';
import styles from './StatligYtelseNotImplementedRow.module.css';

interface StatligYtelseNotImplementedRowProps {
    ytelseText: string;
}

const StatligYtelseNotImplementedRow = ({ ytelseText }: StatligYtelseNotImplementedRowProps) => {
    return (
        <Table.Row key={ytelseText} className={styles.missingStatusRow}>
            <Table.DataCell>
                <IconWithText iconRenderer={() => <InformationIcon />} text={`Mangler informasjon om ${ytelseText}`} />
            </Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
        </Table.Row>
    );
};

export default StatligYtelseNotImplementedRow;
