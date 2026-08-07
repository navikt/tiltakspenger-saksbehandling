import { Table } from '@navikt/ds-react';
import { BenkRevurderingerKolonne, BenkRevurdering } from '../typer/revurderinger';
import { BenkV2Sortering } from '../typer/felles';
import { FnrCelle } from '../felles/FnrCelle';
import { BenkStatusTag } from '../felles/BenkStatusTag';
import { VentestatusCelle } from '../felles/VentestatusCelle';
import { TidspunktCelle } from '../felles/TidspunktCelle';
import { TildeltCelle } from '../felles/TildeltCelle';
import { ResultatCelle } from '../felles/ResultatCelle';
import { RammebehandlingHandlingerCelle } from '../felles/RammebehandlingHandlingerCelle';
import { useBenkSortering } from '../felles/useBenkSortering';
import {
    BeslutterKolonne,
    FnrKolonne,
    HandlingerKolonne,
    ResultatKolonne,
    SaksbehandlerKolonne,
    SistEndretKolonne,
    StartetKolonne,
    StatusKolonne,
    VentestatusKolonne,
} from '../felles/kolonner';

type Props = {
    behandlinger: BenkRevurdering[];
    aktivSortering: BenkV2Sortering<BenkRevurderingerKolonne>;
};

export const RevurderingerTabell = ({ behandlinger, aktivSortering }: Props) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    <FnrKolonne />
                    <ResultatKolonne sortable={true} />
                    <StatusKolonne />
                    <VentestatusKolonne />
                    <StartetKolonne />
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
                        <TidspunktCelle tidspunkt={behandling.startet} kort={true} />
                        <TidspunktCelle tidspunkt={behandling.sistEndret} kort={true} />
                        <TildeltCelle ident={behandling.saksbehandler} />
                        <TildeltCelle ident={behandling.beslutter} />
                        <RammebehandlingHandlingerCelle behandling={behandling} />
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
