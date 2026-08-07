import { Table } from '@navikt/ds-react';
import { BenkMeldekort, BenkMeldekortKolonne } from '../typer/meldekort';
import { BenkV2Behandlingstype, BenkV2Sortering } from '../typer/felles';
import { benkMeldekortTypeTekst } from '../benkV2Utils';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { meldekortbehandlingUrl, meldeperiodeUrl } from '~/utils/urls';
import { FnrCelle } from '../felles/FnrCelle';
import { BenkStatusTag } from '../felles/BenkStatusTag';
import { VentestatusCelle } from '../felles/VentestatusCelle';
import { TidspunktCelle } from '../felles/TidspunktCelle';
import { TildeltCelle } from '../felles/TildeltCelle';
import { BeløpCelle } from '../felles/BeløpCelle';
import { useBenkSortering } from '../felles/useBenkSortering';
import { BenkBehandlingMeny } from '../felles/BenkBehandlingMeny';
import {
    BeløpKolonne,
    FnrKolonne,
    HandlingerKolonne,
    SaksbehandlerKolonne,
    StatusKolonne,
    VentestatusKolonne,
} from '../felles/kolonner';
import { HStack } from '@navikt/ds-react';
import { MeldeperiodekjedeTab } from '~/lib/meldekort/meldeperiodekjede/høyre-seksjon/MeldeperiodekjedeHøyreSeksjon';
import { formaterMeldeperiodeKort } from '~/utils/date';

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
                    <FnrKolonne />
                    <Table.ColumnHeader sortable={true} sortKey={BenkMeldekortKolonne.type}>
                        {'Type'}
                    </Table.ColumnHeader>
                    <StatusKolonne />
                    <VentestatusKolonne />
                    <Table.ColumnHeader sortable={true} sortKey={BenkMeldekortKolonne.periode}>
                        {'Meldeperiode'}
                    </Table.ColumnHeader>
                    <BeløpKolonne />
                    <Table.ColumnHeader sortable={true} sortKey={BenkMeldekortKolonne.mottatt}>
                        {'Mottatt'}
                    </Table.ColumnHeader>
                    <SaksbehandlerKolonne />
                    <HandlingerKolonne />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => (
                    <Table.Row shadeOnHover={false} key={behandling.id}>
                        <FnrCelle fnr={behandling.fnr} saksnummer={behandling.saksnummer} />
                        <Table.DataCell>{benkMeldekortTypeTekst[behandling.type]}</Table.DataCell>
                        <Table.DataCell>
                            <BenkStatusTag
                                status={behandling.status}
                                erUnderkjent={behandling.erUnderkjent}
                            />
                        </Table.DataCell>
                        <VentestatusCelle ventestatus={behandling.ventestatus} />
                        <Table.DataCell align={'right'}>
                            {formaterMeldeperiodeKort(behandling.periode)}
                        </Table.DataCell>
                        <BeløpCelle beløp={behandling.beløp} />
                        <TidspunktCelle tidspunkt={behandling.mottattTidspunkt} />
                        <TildeltCelle ident={behandling.saksbehandler} />
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
                                        {'Se behandling'}
                                    </InternLenkeKnapp>
                                    <BenkBehandlingMeny behandling={behandling} />
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
