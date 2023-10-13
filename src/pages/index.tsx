import React, { useState } from 'react';
import type { NextPage } from 'next';
import { pageWithAuthentication } from '../utils/pageWithAuthentication';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import { Link, Table } from '@navikt/ds-react';

interface Behandling {
    id: string;
    ident: string;
}

const HomePage: NextPage = () => {
    const [behandlinger, setBehandlinger] = useState<Behandling[]>([]);
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

    return (
        <div style={{ paddingLeft: '1rem' }}>
            <Table zebraStripes>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Ident</Table.HeaderCell>
                        <Table.HeaderCell scope="col">ID</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {behandlinger.map(({ id, ident }) => {
                        return (
                            <Table.Row shadeOnHover={false} key={id}>
                                <Table.DataCell>{ident}</Table.DataCell>
                                <Table.DataCell>
                                    <Link href={`/behandling/${id}`}>{id}</Link>
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
