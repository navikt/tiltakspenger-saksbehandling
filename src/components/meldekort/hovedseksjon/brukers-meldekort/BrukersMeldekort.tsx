import { MeldeperiodeProps } from '../../../../types/meldekort/Meldeperiode';
import {
    BrukersMeldekortDagProps,
    BrukersMeldekortProps,
} from '../../../../types/meldekort/BrukersMeldekort';
import { Box, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { formaterDatotekst, ukedagFraDatotekst } from '../../../../utils/date';
import { ikonForBrukersMeldekortDagStatus } from '../Meldekortikoner';
import { brukersMeldekortDagStatusTekst } from '../../../../utils/tekstformateringUtils';
import React from 'react';

import styles from './BrukersMeldekort.module.css';

type Props = {
    meldeperiode: MeldeperiodeProps;
    brukersMeldekort: BrukersMeldekortProps;
};

export const BrukersMeldekortVisning = ({ meldeperiode, brukersMeldekort }: Props) => {
    const uke1 = brukersMeldekort.dager.slice(0, 7);
    const uke2 = brukersMeldekort.dager.slice(7, 14);

    return (
        <VStack gap={'5'}>
            <Heading level={'3'} size={'medium'}>
                {'Innmelding fra bruker'}
            </Heading>
            <VStack gap={'1'}>
                <Uke dager={uke1} meldeperiode={meldeperiode} />
                <Uke dager={uke2} meldeperiode={meldeperiode} />
            </VStack>
        </VStack>
    );
};

type UkeProps = {
    dager: BrukersMeldekortDagProps[];
    meldeperiode: MeldeperiodeProps;
};

const Uke = ({ dager, meldeperiode }: UkeProps) => {
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
                        const harRett = meldeperiode.girRett[dato];

                        return (
                            <Table.Row key={dato.toString()}>
                                <Table.DataCell>{ukedagFraDatotekst(dato)}</Table.DataCell>
                                <Table.DataCell>{formaterDatotekst(dato)}</Table.DataCell>
                                <Table.DataCell>
                                    <HStack align="center" gap="3" wrap={false}>
                                        {ikonForBrukersMeldekortDagStatus[status]}
                                        {`${brukersMeldekortDagStatusTekst[status]}${harRett ? '' : ' (ikke rett)'}`}
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
