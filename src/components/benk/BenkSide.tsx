import {
    Alert,
    Button,
    CopyButton,
    Heading,
    HStack,
    Select,
    Table,
    VStack,
} from '@navikt/ds-react';
import React, { useEffect, useRef, useState } from 'react';
import {
    BehandlingssammendragStatus,
    BehandlingssammendragType,
    BenkOversiktRequest,
    BenkOversiktResponse,
} from '../../types/Behandlingssammendrag';
import { useRouter } from 'next/router';
import { formaterTidspunkt } from '~/utils/date';
import { useSaksbehandler } from '~/context/saksbehandler/SaksbehandlerContext';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { useSearchParams } from 'next/navigation';
import {
    BehandlingssammendragKolonner,
    behandlingsstatusTextFormatter,
    behandlingstypeTextFormatter,
} from './BenkSideUtils';
import SortableTable from '../tabell/SortableTable';
import NextLink from 'next/link';

import styles from './BenkSide.module.css';

type Props = {
    benkOversikt: BenkOversiktResponse;
};

export const BenkOversiktSide = ({ benkOversikt }: Props) => {
    const router = useRouter();
    const firstLoadRef = useRef(true);
    const searchParams = useSearchParams();
    const { innloggetSaksbehandler } = useSaksbehandler();
    const typeParam = searchParams.get('type') as BehandlingssammendragType | null;
    const statusParam = searchParams.get('status') as BehandlingssammendragStatus | null;
    const saksbehandlerParam = searchParams.get('saksbehandler') as string | null;
    const sorteringParam = searchParams.get('sortering') as 'ASC' | 'DESC' | null;

    const [type, setType] = useState<BehandlingssammendragType | 'Alle'>(typeParam ?? 'Alle');
    const [status, setStatus] = useState<BehandlingssammendragStatus | 'Alle'>(
        statusParam ?? 'Alle',
    );
    const [saksbehandler, setSaksbehandler] = useState<string | 'Alle' | 'IKKE_TILDELT'>(
        saksbehandlerParam ?? 'Alle',
    );

    const [filtrertBenkoversikt, setFiltrertBenkoversikt] =
        useState<BenkOversiktResponse>(benkOversikt);

    const fetchOversikt = useFetchJsonFraApi<BenkOversiktResponse, BenkOversiktRequest>(
        `/behandlinger`,
        'POST',
        {
            onSuccess: (oversikt) => setFiltrertBenkoversikt(oversikt!),
        },
    );

    useEffect(() => {
        if (firstLoadRef.current) {
            firstLoadRef.current = false;
            fetchOversikt.trigger({
                behandlingstype: type === 'Alle' ? null : [type],
                status: status === 'Alle' ? null : [status],
                identer: saksbehandler === 'Alle' ? null : [saksbehandler],
                sortering: sorteringParam ?? 'ASC',
            });
            return;
        }
    }, [fetchOversikt, type, status, saksbehandler, sorteringParam]);

    return (
        <VStack gap="5" style={{ padding: '1rem' }}>
            <Heading size="medium" level="2">
                Oversikt over behandlinger og søknader
            </Heading>

            <VStack gap="4">
                <HStack gap="4">
                    <Select
                        label="Type"
                        size="small"
                        value={type}
                        onChange={(e) =>
                            setType(e.target.value as BehandlingssammendragType | 'Alle')
                        }
                    >
                        <option value={'Alle'}>Alle</option>
                        {Object.entries(BehandlingssammendragType).map(([key, value]) => (
                            <option key={key} value={value}>
                                {behandlingstypeTextFormatter[value]}
                            </option>
                        ))}
                    </Select>
                    <Select
                        label="Status"
                        size="small"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value as BehandlingssammendragStatus | 'Alle')
                        }
                    >
                        <option value={'Alle'}>Alle</option>
                        {Object.values(BehandlingssammendragStatus).map((status) => (
                            <option key={status} value={status}>
                                {behandlingsstatusTextFormatter[status]}
                            </option>
                        ))}
                    </Select>
                    <Select
                        label="Saksbehandler/Beslutter"
                        size="small"
                        value={saksbehandler}
                        onChange={(e) => setSaksbehandler(e.target.value)}
                    >
                        <option value={'Alle'}>Alle</option>
                        <option value={'IKKE_TILDELT'}>Ikke tildelt</option>
                        {benkOversikt.behandlingssammendrag
                            .map((behandling) => behandling.saksbehandler)
                            .filter((value, index, self) => value && self.indexOf(value) === index)
                            .map((saksbehandler) => (
                                <option key={saksbehandler} value={saksbehandler!}>
                                    {innloggetSaksbehandler.navIdent === saksbehandler
                                        ? 'Meg'
                                        : saksbehandler}
                                </option>
                            ))}
                    </Select>
                </HStack>
                <HStack gap="4">
                    <Button
                        type="button"
                        size="small"
                        onClick={() => {
                            const query = new URLSearchParams(searchParams.toString());

                            if (type !== 'Alle') {
                                query.set('type', type);
                            } else {
                                query.delete('type');
                            }
                            if (status !== 'Alle') {
                                query.set('status', status);
                            } else {
                                query.delete('status');
                            }
                            if (saksbehandler !== 'Alle') {
                                query.set('saksbehandler', saksbehandler);
                            } else {
                                query.delete('saksbehandler');
                            }
                            if (sorteringParam) {
                                query.set('sortering', sorteringParam);
                            } else {
                                query.delete('sortering');
                            }

                            router.push({ pathname: router.pathname, search: query.toString() });
                            fetchOversikt.trigger({
                                behandlingstype: type === 'Alle' ? null : [type],
                                status: status === 'Alle' ? null : [status],
                                identer: saksbehandler === 'Alle' ? null : [saksbehandler],
                                sortering: sorteringParam ?? 'ASC',
                            });
                        }}
                    >
                        Oppdater filtre
                    </Button>
                    <Button
                        type="button"
                        size="small"
                        variant="secondary"
                        onClick={() => {
                            setType('Alle');
                            setStatus('Alle');
                            setSaksbehandler('Alle');

                            router.push({ pathname: router.pathname });
                            fetchOversikt.trigger({
                                behandlingstype: null,
                                status: null,
                                identer: null,
                                sortering: 'ASC',
                            });
                        }}
                    >
                        Nullstill filtre
                    </Button>
                </HStack>
            </VStack>

            {benkOversikt.totalAntall > 500 && (
                <div className={styles.høytAntallBehandlingerContainer}>
                    <Alert variant="warning" size="small">
                        Det finnes et høyt antall behandlinger på benken. Oversikten er begrenset,
                        og vil ikke vise alle behandlinger.
                    </Alert>
                </div>
            )}

            <SortableTable
                kolonnerConfig={{
                    kolonner: BehandlingssammendragKolonner,
                    defaultKolonneSorteresEtter: BehandlingssammendragKolonner.startet,
                    sortering: {
                        value: sorteringParam ?? 'ASC',
                        onSortChange: (sortKey) => {
                            const currentParams = new URLSearchParams(searchParams.toString());
                            const sortering = sortKey === 'descending' ? 'DESC' : 'ASC';

                            if (sortering === 'DESC') {
                                currentParams.set('sortering', 'DESC');
                            } else if (sortering === 'ASC') {
                                currentParams.delete('sortering');
                            }

                            router.push({
                                pathname: router.pathname,
                                search: currentParams.toString(),
                            });
                            fetchOversikt.trigger({
                                behandlingstype: typeParam ? [typeParam] : null,
                                status: statusParam ? [statusParam] : null,
                                identer: saksbehandlerParam ? [saksbehandlerParam] : null,
                                sortering: sortering,
                            });
                        },
                    },
                }}
                antallRader={filtrertBenkoversikt.behandlingssammendrag.length}
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
                            <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
                            <Table.HeaderCell scope="col"></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                }
                tableBody={
                    <Table.Body>
                        {filtrertBenkoversikt.behandlingssammendrag.map((behandling, idx) => (
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
                                <Table.DataCell>
                                    {formaterTidspunkt(behandling.startet)}
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
        </VStack>
    );
};
