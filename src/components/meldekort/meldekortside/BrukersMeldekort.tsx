import {
    BrukersMeldekortProps,
    BrukersMeldekortDagProps,
} from '../../../types/MeldekortBehandling';
import { MeldeperiodeProps } from '../../../types/Meldeperiode';
import { Box, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../utils/date';
import { velgIkonForMeldekortStatus } from './Meldekortikoner';
import { finnMeldekortdagStatusTekst } from '../../../utils/tekstformateringUtils';
import React from 'react';

import styles from './Meldekort.module.css';

type Props = {
    meldeperiode: MeldeperiodeProps;
    brukersMeldekort: BrukersMeldekortProps;
};

export const BrukersMeldekortVisning = ({ meldeperiode, brukersMeldekort }: Props) => {
    const uke1 = brukersMeldekort.dager.slice(0, 7);
    const uke2 = brukersMeldekort.dager.slice(7, 14);

    return (
        <VStack gap={'5'} justify={'start'}>
            <Heading level={'3'} size={'medium'}>
                {'Innmelding fra bruker'}
            </Heading>
            <Uke dager={uke1} heading={meldeperiode.periode.fraOgMed} />
            <Uke dager={uke2} heading={meldeperiode.periode.tilOgMed} />
        </VStack>
    );
};

const Uke = ({ dager, heading }: { dager: BrukersMeldekortDagProps[]; heading: string }) => {
    return (
        <Box className={styles.utbetalingsuke}>
            <Heading size="small" level="3">
                {heading}
            </Heading>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Dag</Table.HeaderCell>
                        <Table.HeaderCell>Dato</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {dager.map((dag) => (
                        <Table.Row key={dag.dato.toString()}>
                            <Table.DataCell>{ukedagFraDatotekst(dag.dato)}</Table.DataCell>
                            <Table.DataCell>{formaterDatotekst(dag.dato)}</Table.DataCell>
                            <Table.DataCell>
                                <HStack align="center" gap="3" wrap={false}>
                                    {velgIkonForMeldekortStatus(dag.status)}
                                    {finnMeldekortdagStatusTekst(dag.status)}
                                </HStack>
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Box>
    );
};
