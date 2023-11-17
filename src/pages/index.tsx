import React, {FormEvent, useState} from 'react';
import type { NextPage } from 'next';
import { pageWithAuthentication } from '../utils/pageWithAuthentication';
import toast from 'react-hot-toast';
import useSWR, {useSWRConfig} from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import {Button, Link, Table} from '@navikt/ds-react';

interface Behandling {
    id: string;
    ident: string;
    status: string;
    saksbehandler?: string;
}

const HomePage: NextPage = () => {
    const [behandlinger, setBehandlinger] = useState<Behandling[]>([]);
    const mutator = useSWRConfig().mutate;
    const { data, isLoading } = useSWR<Behandling[]>(`/api/behandlinger`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        onSuccess: (data) => {
            console.log(data);
            setBehandlinger(data);
        },
        onError: (error: FetcherError) => toast.error(`[${error.status}]: ${error.info}`),
    });

    const taBehandling = async (behandlingid: string) => {
        const res = fetch(`/api/behandling/ta_behandling/${behandlingid}`, {
            method: 'POST',
        }).then(() => {
            mutator(`/api/behandlinger`).then(() => {
                toast('Behandling tatt');
            });
        });
    };

    const taBehandlingKnappDeaktivert = () => {
        return false //TODO
    }

    return (
        <div style={{ paddingLeft: '1rem' }}>
            <Table zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Ident</Table.HeaderCell>
                        <Table.HeaderCell scope="col">ID</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {behandlinger.map(({ id, ident, saksbehandler, status }) => {
                        return (
                            <Table.Row shadeOnHover={false} key={id}>
                                <Table.DataCell>{ident}</Table.DataCell>
                                <Table.DataCell>
                                    <Link href={`/behandling/${id}`}>{id}</Link>
                                </Table.DataCell>
                                <Table.DataCell>{status}</Table.DataCell>
                                <Table.DataCell>{saksbehandler}</Table.DataCell>
                                <Table.DataCell>
                                    <Button
                                        size="small"
                                        variant="primary"
                                        onClick={() => taBehandling(id)}
                                        disabled={taBehandlingKnappDeaktivert()}
                                    >
                                        Ta behandling
                                    </Button>
                                </Table.DataCell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </div>
    );
};

export default HomePage;

export const getServerSideProps = pageWithAuthentication();
