import React, { useState } from 'react';
import { BodyShort, Button, CopyButton, HStack, Table, Tag } from '@navikt/ds-react';
import { behandlingstypeTextFormatter } from '../benkSideUtils';
import {
    antallKalenderDagerUnnaDagensDato,
    formaterDatotekst,
    formaterTidspunkt,
} from '~/utils/date';
import NextLink from 'next/link';
import {
    BenkBehandling,
    BenkKolonne,
    BenkOversiktResponse,
    BenkSorteringRetning,
} from '~/types/Benk';
import { BenkTabellVisMer } from '~/components/benk/tabell/BenkTabellVisMer';
import { AkselColor } from '@navikt/ds-react/types/theme';
import {
    behandlingResultatTilTag,
    finnBehandlingssammendragStatusTag,
} from '~/utils/tekstformateringUtils';
import { personoversiktUrl } from '~/utils/urls';

import styles from './BenkTabell.module.css';

type Props = {
    data: BenkOversiktResponse;
    sorteringRetningInitial: BenkSorteringRetning;
    onSortChange: (kolonne: BenkKolonne, sorteringRetning: BenkSorteringRetning) => void;
};

export const BenkTabell = ({ data, sorteringRetningInitial, onSortChange }: Props) => {
    const { antallFiltrertPgaTilgang, behandlingssammendrag } = data;

    const [sortertKolonne, setSortertKolonne] = useState<BenkKolonne>(BenkKolonne.startet);

    const [sorteringRetning, setSorteringRetning] =
        useState<BenkSorteringRetning>(sorteringRetningInitial);

    const handleSorterClick = (kolonne: BenkKolonne) => {
        const nyRetning =
            sortertKolonne === kolonne ? (sorteringRetning === 'DESC' ? 'ASC' : 'DESC') : 'ASC';

        setSorteringRetning(nyRetning);
        setSortertKolonne(kolonne);
        onSortChange(kolonne, nyRetning);
    };

    return (
        <div>
            <HStack gap="space-16">
                <BodyShort>{`Antall behandlinger: ${behandlingssammendrag.length}`}</BodyShort>
                {antallFiltrertPgaTilgang > 0 && (
                    <BodyShort>
                        {`Antall behandlinger filtrert vekk pga tilgang: ${antallFiltrertPgaTilgang}`}
                    </BodyShort>
                )}
            </HStack>
            <Table
                zebraStripes={true}
                sort={{
                    orderBy: sortertKolonne,
                    direction: sorteringRetning === 'ASC' ? 'ascending' : 'descending',
                }}
                onSortChange={(sortKey) => handleSorterClick(sortKey as BenkKolonne)}
            >
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader sortable={true} sortKey={BenkKolonne.fnr}>
                            {'Fødselsnummer'}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortable={true} sortKey={BenkKolonne.behandlingstype}>
                            {'Type'}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                            className={styles.kommentar}
                            sortable={true}
                            sortKey={BenkKolonne.ventestatus}
                        >
                            {'Ventestatus'}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortable={true} sortKey={BenkKolonne.status}>
                            {'Status'}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortable={true} sortKey={BenkKolonne.startet}>
                            {'Kravtidspunkt/Startet'}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortable={true} sortKey={BenkKolonne.sistEndret}>
                            {'Sist endret'}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortable={true} sortKey={BenkKolonne.saksbehandler}>
                            {'Saksbehandler'}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader sortable={true} sortKey={BenkKolonne.beslutter}>
                            {'Beslutter'}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader className={styles.handlinger} />
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {data.behandlingssammendrag.map((behandling, idx) => (
                        <Table.Row
                            shadeOnHover={false}
                            key={`${behandling.sakId}-${behandling.startet}-${idx}`}
                        >
                            <Table.HeaderCell scope="row">
                                <HStack align={'center'} gap={'space-4'}>
                                    {behandling.fnr}
                                    <CopyButton
                                        copyText={behandling.fnr}
                                        size={'small'}
                                        data-color={'accent'}
                                    />
                                </HStack>
                            </Table.HeaderCell>
                            <Table.DataCell>
                                <HStack gap={'space-16'} align={'center'}>
                                    <BodyShort>
                                        {behandlingstypeTextFormatter[behandling.behandlingstype]}
                                    </BodyShort>
                                    {behandling.resultat &&
                                        behandlingResultatTilTag(behandling.resultat)}
                                </HStack>
                            </Table.DataCell>
                            <Table.DataCell className={styles.kommentar}>
                                <HStack gap={'space-4'} align={'center'}>
                                    {venteTagFormatter(behandling)}
                                    {behandling?.sattPåVentBegrunnelse && (
                                        <BenkTabellVisMer
                                            tekst={behandling?.sattPåVentBegrunnelse}
                                            visEllipsis={false}
                                        />
                                    )}
                                </HStack>
                            </Table.DataCell>
                            <Table.DataCell>
                                {finnBehandlingssammendragStatusTag(
                                    behandling?.status,
                                    behandling.erUnderkjent,
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
                                    href={personoversiktUrl(behandling)}
                                >
                                    Se sak
                                </Button>
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};

const venteTagFormatter = (behandling: BenkBehandling) => {
    if (!behandling.erSattPåVent) {
        return null;
    }

    if (behandling.sattPåVentFrist) {
        const antallDager = antallKalenderDagerUnnaDagensDato(behandling.sattPåVentFrist);
        let farge: AkselColor;
        if (antallDager <= 0) {
            farge = 'danger';
        } else if (antallDager <= 3) {
            farge = 'warning';
        } else {
            farge = 'info';
        }

        return (
            <Tag data-color={farge} size="small" variant={'moderate'}>
                {`Venter til ${formaterDatotekst(behandling.sattPåVentFrist)}`}
            </Tag>
        );
    }

    return (
        <Tag data-color="danger" size="small" variant={'moderate'}>
            {'Venter'}
        </Tag>
    );
};
