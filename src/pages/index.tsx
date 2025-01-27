import React, { useContext } from 'react';
import { Button, CopyButton, Heading, HStack, Loader, Table, VStack } from '@navikt/ds-react';
import { useHentSøknaderOgBehandlinger } from '../hooks/useHentSøknaderOgBehandlinger';
import { NextPage } from 'next';
import { pageWithAuthentication } from '../auth/pageWithAuthentication';
import { formaterTidspunkt, periodeTilFormatertDatotekst } from '../utils/date';
import { finnBehandlingstypeTekst, finnStatusTekst } from '../utils/tekstformateringUtils';
import Varsel from '../components/varsel/Varsel';
import { BehandlingStatus } from '../types/BehandlingTypes';
import { useOpprettBehandling } from '../hooks/useOpprettBehandling';
import { eierBehandling, skalKunneTaBehandling } from '../utils/tilganger';
import { useTaBehandling } from '../hooks/useTaBehandling';
import { SaksbehandlerContext } from './_app';
import { knappForBehandlingType } from '../components/behandlingsknapper/Benkknapp';
import { preload } from 'swr';
import { fetcher } from '../utils/http';
import Link from 'next/link';

const Oversikten: NextPage = () => {
    preload('/api/behandlinger', fetcher);
    const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
    const { SøknaderOgBehandlinger, isLoading, error } = useHentSøknaderOgBehandlinger();
    const { opprettBehandlingError, isSøknadMutating, onOpprettBehandling } =
        useOpprettBehandling();
    const { onTaBehandling, isBehandlingMutating, taBehandlingError } = useTaBehandling();

    if (isLoading) return <Loader />;
    else if (!SøknaderOgBehandlinger)
        return <Varsel variant="info" melding={`Ingen søknader eller behandlinger i basen`} />;

    const errors = error || opprettBehandlingError || taBehandlingError;

    return (
        <VStack gap="5" style={{ padding: '1rem' }}>
            {errors && <Varsel variant={'error'} melding={errors.message} />}
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
                    {SøknaderOgBehandlinger.map((behandling) => (
                        <Table.Row shadeOnHover={false} key={behandling.id}>
                            <Table.HeaderCell scope="row" style={{ wordBreak: 'unset' }}>
                                <HStack align="center">
                                    {behandling.fnr}
                                    <CopyButton
                                        copyText={behandling.fnr}
                                        variant="action"
                                        size="small"
                                    />
                                </HStack>
                            </Table.HeaderCell>
                            <Table.DataCell>
                                {finnBehandlingstypeTekst(behandling.typeBehandling)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {formaterTidspunkt(behandling.kravtidspunkt) ?? 'Ukjent'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {finnStatusTekst(behandling.status, behandling.underkjent)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.periode &&
                                    `${periodeTilFormatertDatotekst(behandling.periode)}`}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.saksbehandler ?? 'Ikke tildelt'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.beslutter ?? 'Ikke tildelt'}
                            </Table.DataCell>
                            <Table.DataCell scope="col">
                                {knappForBehandlingType(
                                    behandling.status,
                                    behandling.id,
                                    eierBehandling(
                                        behandling.status,
                                        innloggetSaksbehandler,
                                        behandling.saksbehandler,
                                        behandling.beslutter,
                                    ),
                                    skalKunneTaBehandling(
                                        behandling.status,
                                        innloggetSaksbehandler,
                                        behandling.saksbehandler,
                                    ),
                                    onOpprettBehandling,
                                    onTaBehandling,
                                    isSøknadMutating,
                                    isBehandlingMutating,
                                )}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.status !== BehandlingStatus.SØKNAD && (
                                    <>
                                        <Button
                                            as={Link}
                                            style={{ marginRight: '1rem' }}
                                            size="small"
                                            variant={'secondary'}
                                            href={`/sak/${behandling.saksnummer}`}
                                        >
                                            Se sak
                                        </Button>
                                        <Button
                                            as={Link}
                                            size="small"
                                            variant={'secondary'}
                                            href={`/behandling/${behandling.id}/oppsummering`}
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
