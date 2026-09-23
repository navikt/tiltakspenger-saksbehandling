import { Table } from '@navikt/ds-react';
import { BenkTab } from '../../typer/tabs';
import { BenkSortering } from '../../typer/felles';
import { BenkFaneBehandling, BenkFaneKolonne } from '../../typer/benkside';
import { useBenkSortering } from '../useBenkSortering';
import { useBenkVisning } from '../filter/BenkVisningContext';
import { BenkKolonne } from './BenkKolonne';

/** Propsene hver fanes tabell tar imot */
export type BenkFaneTabellProps<T extends BenkTab> = {
    behandlinger: BenkFaneBehandling<T>[];
    aktivSortering: BenkSortering<BenkFaneKolonne<T>>;
};

type Props<Rad extends { id: string }, Kolonne extends string> = {
    kolonner: ReadonlyArray<BenkKolonne<Rad, Kolonne>>;
    behandlinger: Rad[];
    aktivSortering: BenkSortering<Kolonne>;
};

/** Tabellen alle fanene deler. Fanene bestemmer bare hvilke kolonner som vises. */
export const BenkTabell = <Rad extends { id: string }, Kolonne extends string>({
    kolonner,
    behandlinger,
    aktivSortering,
}: Props<Rad, Kolonne>) => {
    const { sort, onSortChange } = useBenkSortering(aktivSortering);
    const { skjulVentestatus } = useBenkVisning();

    const synligeKolonner = kolonner.filter(
        (kolonne) => !(kolonne.skjulesNårPåVentErSkjult && skjulVentestatus),
    );

    return (
        <Table zebraStripes={true} sort={sort} onSortChange={onSortChange}>
            <Table.Header>
                <Table.Row>
                    {synligeKolonner.map((kolonne) => (
                        <Table.ColumnHeader
                            key={kolonne.id}
                            sortable={kolonne.sortKey !== undefined}
                            sortKey={kolonne.sortKey}
                            align={kolonne.align}
                        >
                            {typeof kolonne.tittel === 'function'
                                ? kolonne.tittel(behandlinger)
                                : kolonne.tittel}
                        </Table.ColumnHeader>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {behandlinger.map((rad) => (
                    <Table.Row shadeOnHover={false} key={rad.id}>
                        {synligeKolonner.map((kolonne) =>
                            kolonne.erRadoverskrift ? (
                                <Table.HeaderCell key={kolonne.id} scope={'row'}>
                                    {kolonne.celle(rad)}
                                </Table.HeaderCell>
                            ) : (
                                <Table.DataCell key={kolonne.id} align={kolonne.align}>
                                    {kolonne.celle(rad)}
                                </Table.DataCell>
                            ),
                        )}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
