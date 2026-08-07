import { Table } from '@navikt/ds-react';
import { BenkKlagebehandling, BenkKlageKolonne } from '../typer/klage';
import { BenkV2Sortering } from '../typer/felles';
import { formaterTidspunkt } from '~/utils/date';
import { KlagebehandlingResultatTag } from '~/lib/klage/tags/KlagebehandlingResultatTag';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { klagebehandlingUrl, KlageStegUrlSegment } from '~/utils/urls';
import { FnrCelle } from '../felles/FnrCelle';
import { BenkStatusTag } from '../felles/BenkStatusTag';
import { VentestatusCelle } from '../felles/VentestatusCelle';
import { useBenkSortering } from '../felles/useBenkSortering';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';
import { Nullable } from '~/types/UtilTypes';

type Props = {
    behandlinger: BenkKlagebehandling[];
    aktivSortering: BenkV2Sortering<BenkKlageKolonne>;
};

export const KlageTabell = ({ behandlinger, aktivSortering }: Props) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader sortable={true} sortKey={BenkKlageKolonne.fnr}>
                        {'Fødselsnummer'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkKlageKolonne.resultat}>
                        {'Resultat'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkKlageKolonne.status}>
                        {'Status'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>{'Ventestatus'}</Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkKlageKolonne.kravtidspunkt}>
                        {'Kravtidspunkt'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkKlageKolonne.sistEndret}>
                        {'Sist endret'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkKlageKolonne.saksbehandler}>
                        {'Saksbehandler'}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader sortable={true} sortKey={BenkKlageKolonne.beslutter}>
                        {'Beslutter'}
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
                        <Table.DataCell>
                            {behandling.resultat ? (
                                <KlagebehandlingResultatTag resultat={behandling.resultat} />
                            ) : (
                                '-'
                            )}
                        </Table.DataCell>
                        <Table.DataCell>
                            <BenkStatusTag
                                status={behandling.status}
                                erUnderkjent={behandling.erUnderkjent}
                            />
                        </Table.DataCell>
                        <Table.DataCell>
                            <VentestatusCelle ventestatus={behandling.ventestatus} />
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTidspunkt(behandling.kravtidspunkt)}
                        </Table.DataCell>
                        <Table.DataCell>{formaterTidspunkt(behandling.sistEndret)}</Table.DataCell>
                        <Table.DataCell>
                            {behandling.saksbehandler ?? 'Ikke tildelt'}
                        </Table.DataCell>
                        <Table.DataCell>{behandling.beslutter ?? 'Ikke tildelt'}</Table.DataCell>
                        <Table.DataCell align={'right'}>
                            <InternLenkeKnapp
                                href={klagebehandlingUrl(
                                    behandling.saksnummer,
                                    behandling.id,
                                    klageStegForBenkRad(behandling.resultat),
                                )}
                            >
                                {'Se behandling'}
                            </InternLenkeKnapp>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

/**
 * Speiler `finnSisteGyldigeStegForKlage` med feltene en benk-rad har.
 * Uten resultat vet vi ikke om formkravene er fylt ut, så da lander vi på første steg.
 */
const klageStegForBenkRad = (resultat: Nullable<KlagebehandlingResultat>): KlageStegUrlSegment => {
    switch (resultat) {
        case KlagebehandlingResultat.AVVIST:
            return KlageStegUrlSegment.Brev;
        case KlagebehandlingResultat.OMGJØR:
            return KlageStegUrlSegment.Resultat;
        case KlagebehandlingResultat.OPPRETTHOLDT:
            return KlageStegUrlSegment.Brev;
        case null:
            return KlageStegUrlSegment.Formkrav;
    }
};
