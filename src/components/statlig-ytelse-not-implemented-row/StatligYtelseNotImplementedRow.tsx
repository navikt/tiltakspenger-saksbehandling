import React from 'react';
import { Table } from '@navikt/ds-react';
import { InformationColored } from '@navikt/ds-icons';
import IconWithText from '../icon-with-text/IconWithText';
import styles from './StatligYtelseNotImplementedRow.module.css';

interface StatligYtelseNotImplementedRowProps {
    ytelseText: string;
}

const StatligYtelseNotImplementedRow = ({ ytelseText }: StatligYtelseNotImplementedRowProps) => {
    return (
        <Table.Row key={ytelseText} className={styles.missingStatusRow}>
            <Table.DataCell>
                <IconWithText
                    iconRenderer={() => <InformationColored />}
                    text={`Mangler informasjon om ${ytelseText}`}
                />
            </Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
            <Table.DataCell>-</Table.DataCell>
        </Table.Row>
    );
};

export default StatligYtelseNotImplementedRow;
