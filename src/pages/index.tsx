import React, {FormEvent, useState} from 'react';
import type { NextPage } from 'next';
import { pageWithAuthentication } from '../utils/pageWithAuthentication';
import toast from 'react-hot-toast';
import useSWR, {useSWRConfig} from 'swr';
import { fetcher, FetcherError } from '../utils/http';
import {Button, Link, Table} from '@navikt/ds-react';
import useSaksbehandler from "../core/useSaksbehandler";

interface Behandling {
    id: string;
    ident: string;
    status: string;
    saksbehandler?: string;
    beslutter?: string;
}

const HomePage: NextPage = () => {
    const [behandlinger, setBehandlinger] = useState<Behandling[]>([]);
    const { saksbehandler, isSaksbehandlerLoading } = useSaksbehandler();
    const mutator = useSWRConfig().mutate;
    const { data, isLoading } = useSWR<Behandling[]>(`/api/behandlinger`, fetcher, {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        onSuccess: (data) => {
            setBehandlinger(data);
        },
        onError: (error: FetcherError) => toast.error(`[${error.status}]: ${error.info}`),
    });

    const taBehandling = async (behandlingid: string) => {
        const res = fetch(`/api/behandling/startbehandling/${behandlingid}`, {
            method: 'POST',
        }).then(() => {
            mutator(`/api/behandlinger`).then(() => {
                toast('Behandling tatt');
            });
        });
    };

    const taBehandlingKnappDeaktivert = (saksbehandlerForBehandling?: string) => {
        return !!saksbehandlerForBehandling;
    }

    const behandlingLinkDeaktivert = (saksbehandlerForBehandling?: string, beslutterForBehandling?: string) => {
        return !!saksbehandlerForBehandling;
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
                        <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {behandlinger.map((behandling) => {
                        return (
                            <Table.Row shadeOnHover={false} key={behandling.id}>
                                <Table.DataCell>{behandling.ident}</Table.DataCell>
                                <Table.DataCell>
                                    {(behandling.saksbehandler === saksbehandler?.navIdent ) ? <Link href={`/behandling/${behandling.id}`}>{behandling.id}</Link> : behandling.id}
                                </Table.DataCell>
                                <Table.DataCell>{behandling.status}</Table.DataCell>
                                <Table.DataCell>{behandling.saksbehandler}</Table.DataCell>
                                <Table.DataCell>{behandling.beslutter}</Table.DataCell>
                                <Table.DataCell>
                                    <Button
                                        size="small"
                                        variant="primary"
                                        onClick={() => taBehandling(behandling.id)}
                                        disabled={taBehandlingKnappDeaktivert(behandling.saksbehandler)}
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
