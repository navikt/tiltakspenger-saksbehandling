import { Button, CopyButton, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import Varsel from '../varsel/Varsel';
import {
    finnBehandlingStatusTekst,
    finnBehandlingstypeTekst,
} from '../../utils/tekstformateringUtils';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../../utils/date';
import { StartSøknadBehandling } from '../behandlingsknapper/start-behandling/StartSøknadBehandling';
import { BehandlingKnappForOversikt } from '../behandlingsknapper/BehandlingKnappForOversikt';
import Link from 'next/link';
import React from 'react';
import { BehandlingEllerSøknadForOversiktData } from '../../types/BehandlingTypes';

type Props = {
    søknaderOgBehandlinger: BehandlingEllerSøknadForOversiktData[];
};

export const BenkOversiktSide = ({ søknaderOgBehandlinger }: Props) => {
    return (
        <VStack gap="5" style={{ padding: '1rem' }}>
            <Heading size="medium" level="2">
                Oversikt over behandlinger og søknader
            </Heading>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Fødselsnummer</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Kravtidspunkt</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Handlinger</Table.HeaderCell>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {søknaderOgBehandlinger.length === 0 ? (
                        <Varsel
                            variant="info"
                            melding={`Ingen søknader eller behandlinger i basen`}
                        />
                    ) : (
                        søknaderOgBehandlinger.map((søknadEllerBehandling) => {
                            const {
                                fnr,
                                typeBehandling,
                                kravtidspunkt,
                                status,
                                underkjent,
                                periode,
                                saksbehandler,
                                beslutter,
                                saksnummer,
                                id,
                            } = søknadEllerBehandling;

                            return (
                                <Table.Row shadeOnHover={false} key={id}>
                                    <Table.HeaderCell scope="row" style={{ wordBreak: 'unset' }}>
                                        <HStack align="center">
                                            {fnr}
                                            <CopyButton
                                                copyText={fnr}
                                                variant="action"
                                                size="small"
                                            />
                                        </HStack>
                                    </Table.HeaderCell>
                                    <Table.DataCell>
                                        {finnBehandlingstypeTekst[typeBehandling]}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {kravtidspunkt
                                            ? formaterTidspunkt(kravtidspunkt)
                                            : 'Ukjent'}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {finnBehandlingStatusTekst(status, underkjent)}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {periode && `${periodeTilFormatertDatotekst(periode)}`}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {saksbehandler ?? 'Ikke tildelt'}
                                    </Table.DataCell>
                                    <Table.DataCell>{beslutter ?? 'Ikke tildelt'}</Table.DataCell>
                                    <Table.DataCell scope="col">
                                        {status === 'SØKNAD' ? (
                                            <StartSøknadBehandling søknad={søknadEllerBehandling} />
                                        ) : (
                                            <BehandlingKnappForOversikt
                                                behandling={søknadEllerBehandling}
                                            />
                                        )}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {status !== 'SØKNAD' && (
                                            <>
                                                <Button
                                                    as={Link}
                                                    style={{ marginRight: '1rem' }}
                                                    size="small"
                                                    variant={'secondary'}
                                                    href={`/sak/${saksnummer}`}
                                                >
                                                    Se sak
                                                </Button>
                                                <Button
                                                    as={Link}
                                                    size="small"
                                                    variant={'secondary'}
                                                    href={`/behandling/${id}`}
                                                >
                                                    Se behandling
                                                </Button>
                                            </>
                                        )}
                                    </Table.DataCell>
                                </Table.Row>
                            );
                        })
                    )}
                </Table.Body>
            </Table>
        </VStack>
    );
};
