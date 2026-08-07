import { Table } from '@navikt/ds-react';
import { BenkSøknaderKolonne, BenkSøknadsbehandling } from '../typer/søknader';
import { BenkV2Sortering } from '../typer/felles';
import { søknadstypeTekst } from '~/lib/søknad/søknadTekster';
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
    KravtidspunktKolonne,
    ResultatKolonne,
    SaksbehandlerKolonne,
    SistEndretKolonne,
    StatusKolonne,
    VentestatusKolonne,
} from '../felles/kolonner';

type Props = {
    behandlinger: BenkSøknadsbehandling[];
    aktivSortering: BenkV2Sortering<BenkSøknaderKolonne>;
};

export const SøknaderTabell = ({ behandlinger, aktivSortering }: Props) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    <FnrKolonne />
                    <Table.ColumnHeader sortable={true} sortKey={BenkSøknaderKolonne.søknadstype}>
                        {'Søknadstype'}
                    </Table.ColumnHeader>
                    <ResultatKolonne />
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
                        <Table.DataCell>{søknadstypeTekst[behandling.søknadstype]}</Table.DataCell>
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
                        <RammebehandlingHandlingerCelle behandling={behandling} />
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
