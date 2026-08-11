import { HStack, Table } from '@navikt/ds-react';
import { BenkMeldekort, BenkMeldekortKolonne } from '../typer/meldekort';
import { BenkV2Behandlingstype, BenkV2Sortering } from '../typer/felles';
import { benkMeldekortTypeTekst } from '../utils/benkV2Utils';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { meldekortbehandlingUrl, meldeperiodeUrl } from '~/utils/urls';
import { BenkStatusTag } from '../felles/BenkStatusTag';
import { useBenkSortering } from '../felles/useBenkSortering';
import { BenkBehandlingMeny } from '../felles/BenkBehandlingMeny';
import { BenkTabellKolonneHeader } from '../felles/BenkTabellKolonneHeader';
import { BenkTabellCelle } from '../felles/BenkTabellCelle';
import { MeldeperiodekjedeTab } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/MeldeperiodekjedeHøyreSeksjon';

type Props = {
    behandlinger: BenkMeldekort[];
    aktivSortering: BenkV2Sortering<BenkMeldekortKolonne>;
};

export const BenkMeldekortTabell = ({ behandlinger, aktivSortering }: Props) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    <BenkTabellKolonneHeader.Fnr />
                    <Table.ColumnHeader sortable={true} sortKey={BenkMeldekortKolonne.type}>
                        {'Type'}
                    </Table.ColumnHeader>
                    <BenkTabellKolonneHeader.Status />
                    <BenkTabellKolonneHeader.Ventestatus />
                    <Table.ColumnHeader
                        sortable={true}
                        sortKey={BenkMeldekortKolonne.meldeperioder}
                        align={'right'}
                    >
                        {'Periode'}
                    </Table.ColumnHeader>
                    <BenkTabellKolonneHeader.SistEndret />
                    <BenkTabellKolonneHeader.Beløp />
                    <BenkTabellKolonneHeader.Saksbehandler />
                    <BenkTabellKolonneHeader.Beslutter />
                    <BenkTabellKolonneHeader.Handlinger />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => {
                    const erMeldekortbehandling =
                        behandling.type === BenkV2Behandlingstype.MELDEKORTBEHANDLING;

                    return (
                        <Table.Row shadeOnHover={false} key={behandling.id}>
                            <BenkTabellCelle.Fnr
                                fnr={behandling.fnr}
                                saksnummer={behandling.saksnummer}
                            />
                            <Table.DataCell>
                                {benkMeldekortTypeTekst[behandling.type]}
                            </Table.DataCell>
                            <Table.DataCell>
                                <BenkStatusTag
                                    status={behandling.status}
                                    erUnderkjent={behandling.erUnderkjent}
                                />
                            </Table.DataCell>
                            <BenkTabellCelle.Ventestatus ventestatus={behandling.ventestatus} />
                            <BenkTabellCelle.Meldeperiode
                                meldeperioder={behandling.meldeperioder}
                            />
                            <BenkTabellCelle.Tidspunkt tidspunkt={behandling.sistEndret} />
                            <BenkTabellCelle.Beløp beløp={behandling.beløp} />
                            <BenkTabellCelle.Tildelt
                                ident={erMeldekortbehandling ? behandling.saksbehandler : '-'}
                            />
                            <BenkTabellCelle.Tildelt
                                ident={erMeldekortbehandling ? behandling.beslutter : '-'}
                            />
                            <Table.DataCell align={'right'}>
                                {behandling.type === BenkV2Behandlingstype.MELDEKORTBEHANDLING ? (
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
                                            {'Åpne'}
                                        </InternLenkeKnapp>
                                        <BenkBehandlingMeny behandling={behandling} />
                                    </HStack>
                                ) : (
                                    <InternLenkeKnapp
                                        href={meldeperiodeUrl(
                                            behandling.saksnummer,
                                            // Innsendte/korrigerte meldekort dekker nøyaktig én meldeperiode
                                            behandling.meldeperioder[0],
                                            MeldeperiodekjedeTab.BrukersMeldekort,
                                        )}
                                    >
                                        {'Åpne'}
                                    </InternLenkeKnapp>
                                )}
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};
