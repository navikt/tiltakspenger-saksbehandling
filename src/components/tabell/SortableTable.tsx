import { BodyShort, Table } from '@navikt/ds-react';
import { useState } from 'react';

type ValueOf<T> = T[keyof T];
export type AriaSortVerdi = 'ascending' | 'descending';

interface SorteringConfig<Kolonner extends Record<string, string>> {
    retning: 'ASC' | 'DESC';
    defaultKolonne: ValueOf<Kolonner>;
    onSortChange: (kolonne: ValueOf<Kolonner>, direction: 'ASC' | 'DESC') => void;
}

interface Props<Kolonner extends Record<string, string>> {
    kolonnerConfig: {
        kolonner: Kolonner;
        sortering: SorteringConfig<Kolonner>;
    };
    antallRader?: number;
    tableHeader: React.ReactElement;
    tableBody: React.ReactElement;
}

const SortableTable = <Kolonner extends Record<string, string>>({
    kolonnerConfig,
    antallRader,
    tableHeader,
    tableBody,
}: Props<Kolonner>) => {
    const [sortertKolonne, setSortertKolonne] = useState<ValueOf<Kolonner>>(
        kolonnerConfig.sortering.defaultKolonne,
    );

    const [sortVerdi, setSortVerdi] = useState<AriaSortVerdi>(
        kolonnerConfig.sortering.retning === 'ASC' ? 'ascending' : 'descending',
    );

    const handleSorterClick = (kolonne: ValueOf<Kolonner>) => {
        if (sortertKolonne !== kolonne) {
            setSortertKolonne(kolonne);
            setSortVerdi('ascending');
            kolonnerConfig.sortering.onSortChange(kolonne, 'ASC');
            return;
        }

        const newSortVerdi: AriaSortVerdi = sortVerdi === 'ascending' ? 'descending' : 'ascending';
        setSortVerdi(newSortVerdi);
        kolonnerConfig.sortering.onSortChange(
            kolonne,
            newSortVerdi === 'ascending' ? 'ASC' : 'DESC',
        );
    };

    return (
        <div>
            {antallRader !== undefined && <BodyShort>Antall behandlinger: {antallRader}</BodyShort>}
            <Table
                zebraStripes
                sort={{
                    orderBy: sortertKolonne,
                    direction: sortVerdi,
                }}
                onSortChange={(sortKey) => handleSorterClick(sortKey as ValueOf<Kolonner>)}
            >
                {tableHeader}
                {tableBody}
            </Table>
        </div>
    );
};

export default SortableTable;
