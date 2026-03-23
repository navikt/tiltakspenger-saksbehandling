import { useState } from 'react';
import { BodyShort, Button, CopyButton, HStack, Table, Tag } from '@navikt/ds-react';
import {
    benkBehandlingsstatusColor,
    benkBehandlingsstatusTekst,
    benkBehandlingstypeTekst,
} from '../benkSideUtils';
import { formaterTidspunkt } from '~/utils/date';
import NextLink from 'next/link';
import { BenkBehandling, BenkKolonne, BenkSorteringRetning } from '~/types/Benk';
import { BenkVentestatus } from '~/components/benk/tabell/BenkVentestatus';
import { behandlingResultatTilTag } from '~/utils/tekstformateringUtils';
import { personoversiktUrl } from '~/utils/urls';

import styles from './BenkTabell.module.css';

type Props = {
    behandlinger: BenkBehandling[];
    sorteringRetningInitial: BenkSorteringRetning;
    onSortChange: (kolonne: BenkKolonne, sorteringRetning: BenkSorteringRetning) => void;
};

export const BenkTabell = ({ behandlinger, sorteringRetningInitial, onSortChange }: Props) => {
    const [sortertKolonne, setSortertKolonne] = useState<BenkKolonne>(BenkKolonne.startet);

    const [sorteringRetning, setSorteringRetning] =
        useState<BenkSorteringRetning>(sorteringRetningInitial);

    const handleSorterClick = (kolonne: BenkKolonne) => {
        const nyRetning =
            sortertKolonne === kolonne
                ? sorteringRetning === BenkSorteringRetning.DESC
                    ? BenkSorteringRetning.ASC
                    : BenkSorteringRetning.DESC
                : BenkSorteringRetning.ASC;

        setSorteringRetning(nyRetning);
        setSortertKolonne(kolonne);
        onSortChange(kolonne, nyRetning);
    };

    return (
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
                    <Table.ColumnHeader sortable={true} sortKey={BenkKolonne.ventestatus}>
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
                {behandlinger.map((behandling, idx) => {
                    const {
                        status,
                        sakId,
                        startet,
                        fnr,
                        behandlingstype,
                        resultat,
                        sistEndret,
                        saksbehandler,
                        beslutter,
                        erUnderkjent,
                    } = behandling;

                    return (
                        <Table.Row shadeOnHover={false} key={`${sakId}-${startet}-${idx}`}>
                            <Table.HeaderCell scope="row">
                                <HStack align={'center'} gap={'space-4'}>
                                    {fnr}
                                    <CopyButton
                                        copyText={fnr}
                                        size={'small'}
                                        data-color={'accent'}
                                    />
                                </HStack>
                            </Table.HeaderCell>
                            <Table.DataCell>
                                <HStack gap={'space-16'} align={'center'}>
                                    <BodyShort>
                                        {benkBehandlingstypeTekst[behandlingstype]}
                                    </BodyShort>
                                    {resultat && behandlingResultatTilTag(resultat)}
                                </HStack>
                            </Table.DataCell>
                            <Table.DataCell>
                                <BenkVentestatus behandling={behandling} />
                            </Table.DataCell>
                            <Table.DataCell>
                                <HStack gap={'space-4'} align={'center'}>
                                    <Tag
                                        data-color={benkBehandlingsstatusColor[status]}
                                        variant={'outline'}
                                    >
                                        {benkBehandlingsstatusTekst[status]}
                                    </Tag>
                                    {erUnderkjent && (
                                        <Tag data-color={'warning'} variant={'outline'}>
                                            {'Underkjent'}
                                        </Tag>
                                    )}
                                </HStack>
                            </Table.DataCell>
                            <Table.DataCell>{formaterTidspunkt(startet)}</Table.DataCell>
                            <Table.DataCell>
                                {sistEndret ? formaterTidspunkt(sistEndret) : '-'}
                            </Table.DataCell>
                            <Table.DataCell>{saksbehandler ?? 'Ikke tildelt'}</Table.DataCell>
                            <Table.DataCell>{beslutter ?? 'Ikke tildelt'}</Table.DataCell>
                            <Table.DataCell className={styles.handlinger}>
                                <Button
                                    type={'button'}
                                    variant={'secondary'}
                                    size={'small'}
                                    as={NextLink}
                                    href={personoversiktUrl(behandling)}
                                >
                                    {'Se sak'}
                                </Button>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};
