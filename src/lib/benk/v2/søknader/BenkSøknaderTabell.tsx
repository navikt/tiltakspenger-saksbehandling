import { Table } from '@navikt/ds-react';
import { BenkSøknaderKolonne, BenkSøknadsbehandling } from '../typer/søknader';
import { BenkV2Sortering } from '../typer/felles';
import { søknadstypeTekst } from '~/lib/søknad/søknadTekster';
import { BenkStatusTag } from '../felles/BenkStatusTag';
import { useBenkSortering } from '../felles/useBenkSortering';
import { BenkTabellKolonneHeader } from '../felles/BenkTabellKolonneHeader';
import { BenkTabellCelle } from '../felles/BenkTabellCelle';

type Props = {
    behandlinger: BenkSøknadsbehandling[];
    aktivSortering: BenkV2Sortering<BenkSøknaderKolonne>;
};

export const BenkSøknaderTabell = ({ behandlinger, aktivSortering }: Props) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    <BenkTabellKolonneHeader.Fnr />
                    <Table.ColumnHeader sortable={true} sortKey={BenkSøknaderKolonne.søknadstype}>
                        {'Søknadstype'}
                    </Table.ColumnHeader>
                    <BenkTabellKolonneHeader.Resultat />
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
                        <Table.DataCell>{søknadstypeTekst[behandling.søknadstype]}</Table.DataCell>
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
                        <BenkTabellCelle.RammebehandlingHandlinger behandling={behandling} />
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
