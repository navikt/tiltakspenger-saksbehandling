import React from 'react';
import { Button, CopyButton, Heading, HStack, Loader, Table, VStack } from '@navikt/ds-react';
import { useHentSøknaderOgBehandlinger } from '../hooks/useHentSøknaderOgBehandlinger';
import { NextPage } from 'next';
import { pageWithAuthentication } from '../auth/pageWithAuthentication';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../utils/date';
import { finnBehandlingstypeTekst, finnStatusTekst } from '../utils/tekstformateringUtils';
import Varsel from '../components/varsel/Varsel';
import { BehandlingKnappForOversikt } from '../components/behandlingsknapper/BehandlingKnappForOversikt';
import { preload } from 'swr';
import { fetcher } from '../utils/http';
import Link from 'next/link';
import { SøknadStartBehandlingDeprecated } from '../components/behandlingsknapper/SøknadStartBehandlingDeprecated';

const Oversikten: NextPage = () => {
    preload('/api/behandlinger', fetcher);

    const { SøknaderOgBehandlinger, isLoading, error } = useHentSøknaderOgBehandlinger();

    if (isLoading) {
        return <Loader />;
    }

    if (!SøknaderOgBehandlinger) {
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
                    {SøknaderOgBehandlinger.map((behandlingEllerSøknad) => (
                        <Table.Row shadeOnHover={false} key={behandlingEllerSøknad.id}>
                            <Table.HeaderCell scope="row" style={{ wordBreak: 'unset' }}>
                                <HStack align="center">
                                    {behandlingEllerSøknad.fnr}
                                    <CopyButton
                                        copyText={behandlingEllerSøknad.fnr}
                                        variant="action"
                                        size="small"
                                    />
                                </HStack>
                            </Table.HeaderCell>
                            <Table.DataCell>
                                {finnBehandlingstypeTekst[behandlingEllerSøknad.typeBehandling]}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterTidspunkt(behandlingEllerSøknad.kravtidspunkt) ?? 'Ukjent'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {finnStatusTekst(
                                    behandlingEllerSøknad.status,
                                    behandlingEllerSøknad.underkjent,
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandlingEllerSøknad.periode &&
                                    `${periodeTilFormatertDatotekst(behandlingEllerSøknad.periode)}`}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandlingEllerSøknad.saksbehandler ?? 'Ikke tildelt'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandlingEllerSøknad.beslutter ?? 'Ikke tildelt'}
                            </Table.DataCell>
                            <Table.DataCell scope="col">
                                {behandlingEllerSøknad.status === 'SØKNAD' ? (
                                    <SøknadStartBehandlingDeprecated
                                        søknad={behandlingEllerSøknad}
                                    />
                                ) : (
                                    <BehandlingKnappForOversikt
                                        behandling={behandlingEllerSøknad}
                                    />
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandlingEllerSøknad.status !== 'SØKNAD' && (
                                    <>
                                        <Button
                                            as={Link}
                                            style={{ marginRight: '1rem' }}
                                            size="small"
                                            variant={'secondary'}
                                            href={`/sak/${behandlingEllerSøknad.saksnummer}`}
                                        >
                                            Se sak
                                        </Button>
                                        <Button
                                            as={Link}
                                            size="small"
                                            variant={'secondary'}
                                            href={`/behandling/${behandlingEllerSøknad.id}/oppsummering`}
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
