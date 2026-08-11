import { useRouter } from 'next/router';
import { BenkSortering, BenkSorteringRetning } from '../typer/felles';

/**
 * Sortering skjer server-side - klikk på en kolonne oppdaterer
 * query-parametere og trigger en ny henting av fanens data.
 */
export const useBenkSortering = <Kolonne extends string>(
    aktivSortering: BenkSortering<Kolonne>,
) => {
    const router = useRouter();

    const [sortertKolonne, retning] = aktivSortering.split(',') as [Kolonne, BenkSorteringRetning];

    const onSortChange = (sortKey?: string) => {
        if (!sortKey) {
            return;
        }

        const nyRetning =
            sortertKolonne === sortKey && retning === BenkSorteringRetning.ASC
                ? BenkSorteringRetning.DESC
                : BenkSorteringRetning.ASC;

        router.push({
            query: { ...router.query, sortering: `${sortKey},${nyRetning}` },
        });
    };

    return {
        sort: {
            orderBy: sortertKolonne,
            direction:
                retning === BenkSorteringRetning.ASC
                    ? ('ascending' as const)
                    : ('descending' as const),
        },
        onSortChange,
    };
};
