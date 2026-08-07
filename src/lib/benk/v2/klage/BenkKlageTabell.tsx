import { Table } from '@navikt/ds-react';
import { BenkKlagebehandling, BenkKlageKolonne } from '../typer/klage';
import { BenkV2Sortering } from '../typer/felles';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { klagebehandlingUrl, KlageStegUrlSegment } from '~/utils/urls';
import { BenkStatusTag } from '../felles/BenkStatusTag';
import { useBenkSortering } from '../felles/useBenkSortering';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';
import { Nullable } from '~/types/UtilTypes';
import { BenkTabellKolonneHeader } from '../felles/BenkTabellKolonneHeader';
import { BenkTabellCelle } from '../felles/BenkTabellCelle';

type Props = {
    behandlinger: BenkKlagebehandling[];
    aktivSortering: BenkV2Sortering<BenkKlageKolonne>;
};

export const BenkKlageTabell = ({ behandlinger, aktivSortering }: Props) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    <BenkTabellKolonneHeader.Fnr />
                    <BenkTabellKolonneHeader.Resultat sortable={true} />
                    <BenkTabellKolonneHeader.Status />
                    <BenkTabellKolonneHeader.Ventestatus />
                    <BenkTabellKolonneHeader.Kravtidspunkt />
                    <BenkTabellKolonneHeader.SistEndret />
                    <BenkTabellKolonneHeader.Saksbehandler />
                    <BenkTabellKolonneHeader.Beslutter />
                    <BenkTabellKolonneHeader.Handlinger />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => (
                    <Table.Row shadeOnHover={false} key={behandling.id}>
                        <BenkTabellCelle.Fnr
                            fnr={behandling.fnr}
                            saksnummer={behandling.saksnummer}
                        />
                        <BenkTabellCelle.Resultat behandling={behandling} />
                        <Table.DataCell>
                            <BenkStatusTag
                                status={behandling.status}
                                erUnderkjent={behandling.erUnderkjent}
                            />
                        </Table.DataCell>
                        <BenkTabellCelle.Ventestatus ventestatus={behandling.ventestatus} />
                        <BenkTabellCelle.Tidspunkt tidspunkt={behandling.kravtidspunkt} />
                        <BenkTabellCelle.Tidspunkt tidspunkt={behandling.sistEndret} />
                        <BenkTabellCelle.Tildelt ident={behandling.saksbehandler} />
                        <BenkTabellCelle.Tildelt ident={behandling.beslutter} />
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
