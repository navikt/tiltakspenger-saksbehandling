import React from 'react';
import { Button, CopyButton, HStack, Table } from '@navikt/ds-react';
import SortableTable from '../tabell/SortableTable';
import {
    BehandlingssammendragKolonner,
    behandlingsstatusTextFormatter,
    behandlingstypeTextFormatter,
} from './BenkSideUtils';
import { formaterTidspunkt } from '~/utils/date';
import NextLink from 'next/link';
import { ValueOf } from 'next/dist/shared/lib/constants';
import { BenkOversiktResponse } from '~/types/Behandlingssammendrag';

type Props = {
    data: BenkOversiktResponse;
    sorteringRetning: 'ASC' | 'DESC';
    onSortChange: (
        kolonne: ValueOf<typeof BehandlingssammendragKolonner>,
        sorteringRetning: 'ASC' | 'DESC',
    ) => void;
};

const BenkTabell = ({ data, sorteringRetning, onSortChange }: Props) => {
    return (
        <SortableTable
            kolonnerConfig={{
                kolonner: BehandlingssammendragKolonner,
                sortering: {
                    retning: sorteringRetning,
                    defaultKolonne: BehandlingssammendragKolonner.startet,
                    onSortChange,
                },
            }}
            antallRader={data.behandlingssammendrag.length}
            tableHeader={
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Fødselsnummer</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                        <Table.ColumnHeader
                            sortKey={BehandlingssammendragKolonner.startet}
                            sortable
                        >
                            Kravtidspunkt/Startet
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            sortKey={BehandlingssammendragKolonner.sistEndret}
                            sortable
                        >
                            Sist endret
                        </Table.ColumnHeader>
                        <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            }
            tableBody={
                <Table.Body>
                    {data.behandlingssammendrag.map((behandling, idx) => (
                        <Table.Row
                            shadeOnHover={false}
                            key={`${behandling.sakId}-${behandling.startet}-${idx}`}
                        >
                            <Table.HeaderCell scope="row">
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
                                {behandlingstypeTextFormatter[behandling.behandlingstype]}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.status
                                    ? behandlingsstatusTextFormatter[behandling.status]
                                    : '-'}
                            </Table.DataCell>
                            <Table.DataCell>{formaterTidspunkt(behandling.startet)}</Table.DataCell>
                            <Table.DataCell>
                                {behandling.sistEndret
                                    ? formaterTidspunkt(behandling.sistEndret)
                                    : '-'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.saksbehandler ?? 'Ikke tildelt'}
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.beslutter ?? 'Ikke tildelt'}
                            </Table.DataCell>
                            <Table.DataCell>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="small"
                                    as={NextLink}
                                    href={`/sak/${behandling.saksnummer}`}
                                >
                                    Se sak
                                </Button>
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            }
        />
    );
};

export default BenkTabell;
