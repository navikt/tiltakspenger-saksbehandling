import { Table } from '@navikt/ds-react';
import { BenkKlagebehandling, BenkKlageKolonne } from '../typer/klage';
import { BenkSortering } from '../typer/felles';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { klagebehandlingUrl, KlageStegUrlSegment } from '~/utils/urls';
import { hentVerdi } from '~/utils/sladdetVerdi';
import { BenkKlageStatusTag } from '../felles/BenkStatusTag';
import { useBenkSortering } from '../felles/useBenkSortering';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';
import { Nullable } from '~/types/UtilTypes';
import { BenkTabellKolonneHeader } from '../felles/BenkTabellKolonneHeader';
import { BenkTabellCelle } from '../felles/BenkTabellCelle';
import { BenkTab } from '~/lib/benk/typer/tabs';
import { benkBehandlingHarTilgang } from '../utils/benkUtils';

type Props = {
    behandlinger: BenkKlagebehandling[];
    aktivSortering: BenkSortering<BenkKlageKolonne>;
};

export const BenkKlageTabell = ({ behandlinger, aktivSortering }: Props) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    <BenkTabellKolonneHeader.Fnr />
                    <BenkTabellKolonneHeader.Resultat />
                    <BenkTabellKolonneHeader.Status />
                    <BenkTabellKolonneHeader.Ventestatus />
                    <BenkTabellKolonneHeader.Kravtidspunkt />
                    <BenkTabellKolonneHeader.SistEndret />
                    <BenkTabellKolonneHeader.Saksbehandler />
                    <BenkTabellKolonneHeader.Handlinger tab={BenkTab.KLAGE} />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => (
                    <Table.Row shadeOnHover={false} key={behandling.id}>
                        <BenkTabellCelle.Fnr behandling={behandling} />
                        <BenkTabellCelle.Resultat behandling={behandling} />
                        <Table.DataCell>
                            <BenkKlageStatusTag status={behandling.status} />
                        </Table.DataCell>
                        <BenkTabellCelle.Ventestatus behandling={behandling} />
                        <BenkTabellCelle.Tidspunkt tidspunkt={behandling.kravtidspunkt} />
                        <BenkTabellCelle.Tidspunkt tidspunkt={behandling.sistEndret} />
                        <BenkTabellCelle.Tildelt ident={behandling.saksbehandler} />
                        <BenkTabellCelle.Handlinger behandling={behandling}>
                            {benkBehandlingHarTilgang(behandling) && (
                                <InternLenkeKnapp
                                    href={klagebehandlingUrl(
                                        hentVerdi(behandling.saksnummer),
                                        behandling.id,
                                        klageStegForBenkRad(behandling.resultat),
                                    )}
                                >
                                    {'Åpne'}
                                </InternLenkeKnapp>
                            )}
                        </BenkTabellCelle.Handlinger>
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
