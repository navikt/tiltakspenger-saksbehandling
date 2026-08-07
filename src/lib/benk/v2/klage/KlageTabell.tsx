import { Table } from '@navikt/ds-react';
import { BenkKlagebehandling, BenkKlageKolonne } from '../typer/klage';
import { BenkV2Sortering } from '../typer/felles';
import { InternLenkeKnapp } from '~/lib/_felles/intern-lenke/InternLenkeKnapp';
import { klagebehandlingUrl, KlageStegUrlSegment } from '~/utils/urls';
import { FnrCelle } from '../felles/FnrCelle';
import { BenkStatusTag } from '../felles/BenkStatusTag';
import { VentestatusCelle } from '../felles/VentestatusCelle';
import { TidspunktCelle } from '../felles/TidspunktCelle';
import { TildeltCelle } from '../felles/TildeltCelle';
import { ResultatCelle } from '../felles/ResultatCelle';
import { useBenkSortering } from '../felles/useBenkSortering';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';
import { Nullable } from '~/types/UtilTypes';
import {
    BeslutterKolonne,
    FnrKolonne,
    HandlingerKolonne,
    KravtidspunktKolonne,
    ResultatKolonne,
    SaksbehandlerKolonne,
    SistEndretKolonne,
    StatusKolonne,
    VentestatusKolonne,
} from '../felles/kolonner';

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
                    <FnrKolonne />
                    <ResultatKolonne sortable={true} />
                    <StatusKolonne />
                    <VentestatusKolonne />
                    <KravtidspunktKolonne />
                    <SistEndretKolonne />
                    <SaksbehandlerKolonne />
                    <BeslutterKolonne />
                    <HandlingerKolonne />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((behandling) => (
                    <Table.Row shadeOnHover={false} key={behandling.id}>
                        <FnrCelle fnr={behandling.fnr} saksnummer={behandling.saksnummer} />
                        <ResultatCelle behandling={behandling} />
                        <Table.DataCell>
                            <BenkStatusTag
                                status={behandling.status}
                                erUnderkjent={behandling.erUnderkjent}
                            />
                        </Table.DataCell>
                        <VentestatusCelle ventestatus={behandling.ventestatus} />
                        <TidspunktCelle tidspunkt={behandling.kravtidspunkt} />
                        <TidspunktCelle tidspunkt={behandling.sistEndret} />
                        <TildeltCelle ident={behandling.saksbehandler} />
                        <TildeltCelle ident={behandling.beslutter} />
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
