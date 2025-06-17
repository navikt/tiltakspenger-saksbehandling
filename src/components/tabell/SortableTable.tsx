import { BodyShort, Table } from '@navikt/ds-react';
import { useState } from 'react';

interface Props<Kolonner extends Record<string, string>> {
    kolonnerConfig: {
        kolonner: Kolonner;
        defaultKolonneSorteresEtter: ValueOf<Kolonner>;
        sortering: {
            value: 'ASC' | 'DESC';
            onSortChange?: (sortKey: AriaSortVerdi) => void;
        };
    };
    antallRader?: number;
    tableHeader: React.ReactElement;
    tableBody: React.ReactElement;
}

type ValueOf<T> = T[keyof T];
export type AriaSortVerdi = 'ascending' | 'descending';

/**
 * En tabell som har intern state for visning av sortering. Merk at den forventer at sortering er gjort
 */
const SortableTable = <Kolonner extends Record<string, string>>(props: Props<Kolonner>) => {
    const [sortVerdi, setSortVerdi] = useState<AriaSortVerdi>(
        props.kolonnerConfig.sortering.value === 'ASC' ? 'ascending' : 'descending',
    );
    const [sortertKolonne, setSortertKolonne] = useState<ValueOf<Kolonner>>(
        props.kolonnerConfig.defaultKolonneSorteresEtter,
    );

    const handleSorterClick = (kolonne: ValueOf<Kolonner>) => {
        if (sortertKolonne !== kolonne) {
            setSortertKolonne(kolonne);
            setSortVerdi('ascending');
            return;
        }

        setSortVerdi(nesteSortVerdi(sortVerdi));
    };

    const nesteSortVerdi = (sortVerdi: AriaSortVerdi) => {
        switch (sortVerdi) {
            case 'ascending': {
                props.kolonnerConfig.sortering.onSortChange?.('descending');
                return 'descending';
            }
            case 'descending': {
                props.kolonnerConfig.sortering.onSortChange?.('ascending');
                return 'ascending';
            }
        }
    };

    return (
        <div>
            {props.antallRader && <BodyShort>Antall behandlinger: {props.antallRader}</BodyShort>}
            <Table
                zebraStripes
                sort={
                    sortertKolonne
                        ? {
                              orderBy: sortertKolonne,
                              direction:
                                  props.kolonnerConfig.sortering.value === 'ASC'
                                      ? 'ascending'
                                      : 'descending',
                          }
                        : undefined
                }
                onSortChange={(sortKey) => handleSorterClick(sortKey as ValueOf<Kolonner>)}
            >
                {props.tableHeader}
                {props.tableBody}
            </Table>
        </div>
    );
};

export default SortableTable;
