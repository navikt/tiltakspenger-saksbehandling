import React from 'react';
import { BodyShort, Button, CopyButton, HStack, Table, Tag } from '@navikt/ds-react';
import styles from './BenkTabell.module.css';
import SortableTable from '../tabell/SortableTable';
import {
    BehandlingssammendragKolonner,
    behandlingsstatusTextFormatter,
    behandlingstypeTextFormatter,
} from './BenkSideUtils';
import { formaterTidspunkt } from '~/utils/date';
import NextLink from 'next/link';
import { ValueOf } from 'next/dist/shared/lib/constants';
import {
    Behandlingssammendrag,
    BehandlingssammendragStatus,
    BehandlingssammendragType,
    BenkOversiktResponse,
} from '~/types/Behandlingssammendrag';
import { PERSONOVERSIKT_TABS } from '~/components/personoversikt/Personoversikt';
import VisMerTekst from '~/components/benk/VisMerTekst';

type Props = {
    data: BenkOversiktResponse;
    sorteringRetning: 'ASC' | 'DESC';
    onSortChange: (
        kolonne: ValueOf<typeof BehandlingssammendragKolonner>,
        sorteringRetning: 'ASC' | 'DESC',
    ) => void;
};

const BenkTabell = ({ data, sorteringRetning, onSortChange }: Props) => {
    const urlMedValgtTab = (behandling: Behandlingssammendrag) => {
        if (
            behandling.behandlingstype === BehandlingssammendragType.MELDEKORTBEHANDLING ||
            behandling.behandlingstype === BehandlingssammendragType.INNSENDT_MELDEKORT ||
            behandling.behandlingstype === BehandlingssammendragType.KORRIGERT_MELDEKORT
        ) {
            return `/sak/${behandling.saksnummer}#${PERSONOVERSIKT_TABS.meldekort}`;
        }

        return `/sak/${behandling.saksnummer}`;
    };

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
            antallRaderFiltrertVekk={data.antallFiltrertPgaTilgang}
            tableHeader={
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Fødselsnummer</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                        <Table.HeaderCell scope="col" className={styles.kommentar}>
                            Kommentar
                        </Table.HeaderCell>
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
                        <Table.HeaderCell
                            scope="col"
                            className={styles.handlinger}
                        ></Table.HeaderCell>
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
                                <HStack gap="space-8">
                                    <BodyShort>
                                        {behandlingstypeTextFormatter[behandling.behandlingstype]}
                                    </BodyShort>
                                    {(behandling.behandlingstype ===
                                        BehandlingssammendragType.SØKNADSBEHANDLING ||
                                        behandling.behandlingstype ===
                                            BehandlingssammendragType.REVURDERING) &&
                                        behandling.erSattPåVent && (
                                            <Tag
                                                data-color="danger"
                                                size="small"
                                                variant={'moderate'}
                                            >
                                                Venter
                                            </Tag>
                                        )}
                                </HStack>
                            </Table.DataCell>
                            <Table.DataCell className={styles.kommentar}>
                                <VisMerTekst
                                    tekst={behandling?.sattPåVentBegrunnelse}
                                    antallTegnFørVisMer={40}
                                />
                            </Table.DataCell>
                            <Table.DataCell>
                                {behandling.status ===
                                BehandlingssammendragStatus.KLAR_TIL_BEHANDLING ? (
                                    <Tag data-color="success" variant="outline">
                                        {behandlingsstatusTextFormatter[behandling.status]}
                                    </Tag>
                                ) : behandling.status ===
                                  BehandlingssammendragStatus.KLAR_TIL_BESLUTNING ? (
                                    <Tag data-color="meta-lime" variant="outline">
                                        {behandlingsstatusTextFormatter[behandling.status]}
                                    </Tag>
                                ) : behandling.status ? (
                                    behandlingsstatusTextFormatter[behandling.status]
                                ) : (
                                    '-'
                                )}
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
                            <Table.DataCell className={styles.handlinger}>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="small"
                                    as={NextLink}
                                    href={urlMedValgtTab(behandling)}
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
