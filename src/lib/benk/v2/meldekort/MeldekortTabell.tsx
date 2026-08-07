import { Table } from '@navikt/ds-react';
import { BenkMeldekort, BenkMeldekortKolonne, BenkMeldekortType } from '../typer/meldekort';
import { BenkV2Sortering } from '../typer/felles';
import { formaterPeriode, formaterTidspunkt } from '~/utils/date';
import { formatterBeløp } from '~/lib/_felles/utbetaling/beløp/beløpUtils';
import { benkMeldekortTypeTekst } from '../benkV2Utils';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { meldekortbehandlingUrl, meldeperiodeUrl } from '~/utils/urls';
import { FnrCelle } from '../felles/FnrCelle';
import { BenkStatusTag } from '../felles/BenkStatusTag';
import { VentestatusCelle } from '../felles/VentestatusCelle';
import { useBenkSortering } from '../felles/useBenkSortering';
import { BenkBehandlingMeny } from '../felles/BenkBehandlingMeny';
import { HStack } from '@navikt/ds-react';
import { MeldeperiodekjedeTab } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/MeldeperiodekjedeHøyreSeksjon';

type Props = {
    behandlinger: BenkMeldekort[];
    aktivSortering: BenkV2Sortering<BenkMeldekortKolonne>;
};

export const MeldekortTabell = ({ behandlinger, aktivSortering }: Props) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader sortable={true} sortKey={BenkMeldekortKolonne.fnr}>
                        {'Fødselsnummer'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkMeldekortKolonne.type}>
                        {'Type'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkMeldekortKolonne.status}>
                        {'Status'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>{'Ventestatus'}</Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkMeldekortKolonne.periode}>
                        {'Meldeperiode'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkMeldekortKolonne.beløp}>
                        {'Beløp'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkMeldekortKolonne.mottatt}>
                        {'Mottatt'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                        sortable={true}
                        sortKey={BenkMeldekortKolonne.saksbehandler}
                    >
                        {'Saksbehandler'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => (
                    <Table.Row shadeOnHover={false} key={behandling.id}>
                        <Table.HeaderCell scope={'row'}>
                            <FnrCelle fnr={behandling.fnr} saksnummer={behandling.saksnummer} />
                        </Table.HeaderCell>
                        <Table.DataCell>{benkMeldekortTypeTekst[behandling.type]}</Table.DataCell>
                        <Table.DataCell>
                            <BenkStatusTag
                                status={behandling.status}
                                erUnderkjent={behandling.erUnderkjent}
                            />
                        </Table.DataCell>
                        <Table.DataCell>
                            <VentestatusCelle ventestatus={behandling.ventestatus} />
                        </Table.DataCell>
                        <Table.DataCell>{formaterPeriode(behandling.periode)}</Table.DataCell>
                        <Table.DataCell align={'right'}>
                            {behandling.beløp !== null ? formatterBeløp(behandling.beløp) : '-'}
                        </Table.DataCell>
                        <Table.DataCell>
                            {behandling.mottattTidspunkt
                                ? formaterTidspunkt(behandling.mottattTidspunkt)
                                : '-'}
                        </Table.DataCell>
                        <Table.DataCell>
                            {behandling.saksbehandler ?? 'Ikke tildelt'}
                        </Table.DataCell>
                        <Table.DataCell align={'right'}>
                            {behandling.type === BenkMeldekortType.MELDEKORTBEHANDLING ? (
                                <HStack
                                    gap={'space-8'}
                                    justify={'end'}
                                    align={'center'}
                                    wrap={false}
                                >
                                    <InternLenkeKnapp
                                        href={meldekortbehandlingUrl(
                                            behandling.saksnummer,
                                            behandling.id,
                                        )}
                                    >
                                        {'Se behandling'}
                                    </InternLenkeKnapp>
                                    <BenkBehandlingMeny
                                        behandling={behandling}
                                        behandlingstype={'MELDEKORTBEHANDLING'}
                                    />
                                </HStack>
                            ) : (
                                <InternLenkeKnapp
                                    href={meldeperiodeUrl(
                                        behandling.saksnummer,
                                        behandling.periode,
                                        MeldeperiodekjedeTab.BrukersMeldekort,
                                    )}
                                >
                                    {'Se meldekort'}
                                </InternLenkeKnapp>
                            )}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
