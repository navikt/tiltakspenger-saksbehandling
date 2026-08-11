import { Table } from '@navikt/ds-react';
import { BenkRevurderingerKolonne, BenkRevurdering } from '../typer/revurderinger';
import { BenkSortering } from '../typer/felles';
import { BenkStatusTag } from '../felles/BenkStatusTag';
import { useBenkSortering } from '../felles/useBenkSortering';
import { BenkTabellKolonneHeader } from '../felles/BenkTabellKolonneHeader';
import { BenkTabellCelle } from '../felles/BenkTabellCelle';

type Props = {
    behandlinger: BenkRevurdering[];
    aktivSortering: BenkSortering<BenkRevurderingerKolonne>;
};

export const BenkRevurderingerTabell = ({ behandlinger, aktivSortering }: Props) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    <BenkTabellKolonneHeader.Fnr />
                    <BenkTabellKolonneHeader.Resultat />
                    <BenkTabellKolonneHeader.Status />
                    <BenkTabellKolonneHeader.Ventestatus />
                    <BenkTabellKolonneHeader.Startet />
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
                        <BenkTabellCelle.Tidspunkt tidspunkt={behandling.startet} />
                        <BenkTabellCelle.Tidspunkt tidspunkt={behandling.sistEndret} />
                        <BenkTabellCelle.Tildelt ident={behandling.saksbehandler} />
                        <BenkTabellCelle.Tildelt ident={behandling.beslutter} />
                        <BenkTabellCelle.RammebehandlingHandlinger behandling={behandling} />
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
