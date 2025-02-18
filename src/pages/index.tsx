import React from 'react';
import { Button, CopyButton, Heading, HStack, Loader, Table, VStack } from '@navikt/ds-react';
import { useHentSøknaderOgBehandlinger } from '../hooks/useHentSøknaderOgBehandlinger';
import { NextPage } from 'next';
import { pageWithAuthentication } from '../auth/pageWithAuthentication';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../utils/date';
import {
    finnBehandlingstypeTekst,
    finnBehandlingStatusTekst,
} from '../utils/tekstformateringUtils';
import Varsel from '../components/varsel/Varsel';
import { BehandlingKnappForOversikt } from '../components/behandlingsknapper/BehandlingKnappForOversikt';
import { preload } from 'swr';
import { fetcher } from '../utils/http';
import Link from 'next/link';
import { StartSøknadBehandling } from '../components/behandlingsknapper/start-behandling/StartSøknadBehandling';
import { SøknadStartBehandlingDeprecated } from '../components/behandlingsknapper/SøknadStartBehandlingDeprecated';

const Oversikten: NextPage = () => {
    preload('/api/behandlinger', fetcher);

    const { søknaderOgBehandlinger, isLoading, error } = useHentSøknaderOgBehandlinger();

    if (isLoading) {
        return <Loader />;
    }

    if (!søknaderOgBehandlinger) {
        return <Varsel variant="info" melding={`Ingen søknader eller behandlinger i basen`} />;
    }

    return (
        <VStack gap="5" style={{ padding: '1rem' }}>
            {error && <Varsel variant={'error'} melding={error.message} />}
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
                    {søknaderOgBehandlinger.map((søknadEllerBehandling) => (
                        <Table.Row shadeOnHover={false} key={søknadEllerBehandling.id}>
                            <Table.HeaderCell scope="row" style={{ wordBreak: 'unset' }}>
                                <HStack align="center">
                                    {søknadEllerBehandling.fnr}
                                    <CopyButton
                                        copyText={søknadEllerBehandling.fnr}
                                        variant="action"
                                        size="small"
                                    />
                                </HStack>
                            </Table.HeaderCell>
                            <Table.DataCell>
                                {finnBehandlingstypeTekst[søknadEllerBehandling.typeBehandling]}
                                {søknadEllerBehandling.erDeprecatedBehandling === false
                                    ? ' (V2)'
                                    : ''}
                            </Table.DataCell>
                            <Table.DataCell>
                                {søknadEllerBehandling.kravtidspunkt
                                    ? formaterTidspunkt(søknadEllerBehandling.kravtidspunkt)
                                    : 'Ukjent'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {finnBehandlingStatusTekst(
                                    søknadEllerBehandling.status,
                                    søknadEllerBehandling.underkjent,
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                {søknadEllerBehandling.periode &&
                                    `${periodeTilFormatertDatotekst(søknadEllerBehandling.periode)}`}
                            </Table.DataCell>
                            <Table.DataCell>
                                {søknadEllerBehandling.saksbehandler ?? 'Ikke tildelt'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {søknadEllerBehandling.beslutter ?? 'Ikke tildelt'}
                            </Table.DataCell>
                            <Table.DataCell scope="col">
                                {søknadEllerBehandling.status === 'SØKNAD' ? (
                                    <>
                                        <SøknadStartBehandlingDeprecated
                                            søknad={søknadEllerBehandling}
                                        />
                                        <StartSøknadBehandling søknad={søknadEllerBehandling} />
                                    </>
                                ) : (
                                    <BehandlingKnappForOversikt
                                        behandling={søknadEllerBehandling}
                                    />
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                {søknadEllerBehandling.status !== 'SØKNAD' && (
                                    <>
                                        <Button
                                            as={Link}
                                            style={{ marginRight: '1rem' }}
                                            size="small"
                                            variant={'secondary'}
                                            href={`/sak/${søknadEllerBehandling.saksnummer}`}
                                        >
                                            Se sak
                                        </Button>
                                        <Button
                                            as={Link}
                                            size="small"
                                            variant={'secondary'}
                                            href={`/behandling/${søknadEllerBehandling.id}/oppsummering`}
                                        >
                                            Se behandling
                                        </Button>
                                    </>
                                )}
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </VStack>
    );
};

export default Oversikten;

export const getServerSideProps = pageWithAuthentication();
