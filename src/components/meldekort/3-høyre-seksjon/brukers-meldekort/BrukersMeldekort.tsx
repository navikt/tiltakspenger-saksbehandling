import {
    BrukersMeldekortDagProps,
    BrukersMeldekortProps,
} from '../../../../types/meldekort/BrukersMeldekort';
import { Alert, BodyShort, Box, HStack, Table, VStack } from '@navikt/ds-react';
import { formaterDatotekst, formaterTidspunkt, ukedagFraDatotekst } from '../../../../utils/date';
import { ikonForBrukersMeldekortDagStatus } from '../../0-felles-komponenter/MeldekortIkoner';
import { brukersMeldekortDagStatusTekst } from '../../../../utils/tekstformateringUtils';
import React from 'react';

import styles from './BrukersMeldekort.module.css';

type Props = {
    brukersMeldekort: BrukersMeldekortProps;
};

export const BrukersMeldekortVisning = ({ brukersMeldekort }: Props) => {
    const uke1 = brukersMeldekort.dager.slice(0, 7);
    const uke2 = brukersMeldekort.dager.slice(7, 14);

    return (
        <VStack gap={'1'}>
            <Alert variant={'info'} inline={true} size={'small'} className={styles.mottatt}>
                <BodyShort>
                    {'Mottatt fra bruker: '}
                    <strong>{formaterTidspunkt(brukersMeldekort.mottatt)}</strong>
                </BodyShort>
            </Alert>
            <Uke dager={uke1} />
            <Uke dager={uke2} />
        </VStack>
    );
};

type UkeProps = {
    dager: BrukersMeldekortDagProps[];
};

const Uke = ({ dager }: UkeProps) => {
    return (
        <Box className={styles.utbetalingsuke}>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Dag</Table.HeaderCell>
                        <Table.HeaderCell>Dato</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {dager.map((dag) => {
                        const { dato, status } = dag;

                        return (
                            <Table.Row key={dato.toString()}>
                                <Table.DataCell>{ukedagFraDatotekst(dato)}</Table.DataCell>
                                <Table.DataCell>{formaterDatotekst(dato)}</Table.DataCell>
                                <Table.DataCell>
                                    <HStack align="center" gap="3" wrap={false}>
                                        {ikonForBrukersMeldekortDagStatus[status]}
                                        {`${brukersMeldekortDagStatusTekst[status]}`}
                                    </HStack>
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </Box>
    );
};
