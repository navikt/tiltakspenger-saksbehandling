import { useState } from 'react';
import {
    BodyShort,
    Button,
    CopyButton,
    HStack,
    Loader,
    Skeleton,
    Table,
    Tag,
} from '@navikt/ds-react';
import {
    BENK_SORTERING_DEFAULT,
    benkBehandlingsstatusColor,
    benkBehandlingsstatusTekst,
    benkBehandlingstypeTekst,
    parseBenkSortering,
} from '../benkSideUtils';
import { formaterTidspunkt } from '~/utils/date';
import NextLink from 'next/link';
import {
    BenkBehandling,
    BenkBehandlingstype,
    BenkKolonne,
    BenkSortering,
    BenkSorteringRetning,
} from '~/lib/benk/typer/Benk';
import { BenkVentestatus } from '~/lib/benk/tabell/BenkVentestatus';
import { behandlingResultatTilTag } from '~/utils/tekstformateringUtils';
import { personoversiktUrl } from '~/utils/urls';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { formatterBeløp } from '~/utils/beløp';

import styles from './BenkTabell.module.css';

type Props = {
    behandlinger: BenkBehandling[];
    valgtType: BenkBehandlingstype | null;
};

export const BenkTabell = ({ behandlinger, valgtType }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [kolonneFraParams, retningFraParams] = parseBenkSortering(searchParams.get('sortering'));

    const [sortertKolonne, setSortertKolonne] = useState<BenkKolonne>(kolonneFraParams);
    const [sorteringRetning, setSorteringRetning] =
        useState<BenkSorteringRetning>(retningFraParams);

    const [isLoading, setIsLoading] = useState(false);

    const handleSorterClick = (nyKolonne: BenkKolonne) => {
        const nyRetning =
            sortertKolonne === nyKolonne
                ? sorteringRetning === BenkSorteringRetning.DESC
                    ? BenkSorteringRetning.ASC
                    : BenkSorteringRetning.DESC
                : BenkSorteringRetning.ASC;

        setSorteringRetning(nyRetning);
        setSortertKolonne(nyKolonne);

        const sortering: BenkSortering = `${nyKolonne},${nyRetning}`;

        const currentParams = new URLSearchParams(searchParams.toString());

        if (sortering === BENK_SORTERING_DEFAULT) {
            currentParams.delete('sortering');
        } else {
            currentParams.set('sortering', sortering);
        }

        setIsLoading(true);

        router
            .push({
                pathname: router.pathname,
                search: currentParams.toString(),
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Table
            zebraStripes={true}
            sort={{
                orderBy: sortertKolonne,
                direction:
                    sorteringRetning === BenkSorteringRetning.ASC ? 'ascending' : 'descending',
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
                    {valgtType === BenkBehandlingstype.TILBAKEKREVING && (
                        <Table.ColumnHeader sortable={true} sortKey={BenkKolonne.beløp}>
                            {'Beløp'}
                        </Table.ColumnHeader>
                    )}
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
                {isLoading && (
                    <Table.Row>
                        <Table.DataCell>
                            <Loader />
                        </Table.DataCell>
                        <Table.DataCell>{'Oppdaterer sortering...'}</Table.DataCell>
                        <Table.DataCell colSpan={7}>
                            <Skeleton variant={'text'} />
                        </Table.DataCell>
                    </Table.Row>
                )}

                {behandlinger.map((behandling) => {
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
                        beløp,
                    } = behandling;

                    return (
                        <Table.Row shadeOnHover={false} key={`${sakId}-${startet}`}>
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
                            {valgtType === BenkBehandlingstype.TILBAKEKREVING && (
                                <Table.DataCell align={'right'}>
                                    {beløp ? formatterBeløp(beløp) : '-'}
                                </Table.DataCell>
                            )}
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
