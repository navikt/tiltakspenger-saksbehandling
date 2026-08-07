import { useRouter } from 'next/router';
import { BenkV2Sortering, BenkV2SorteringRetning } from '../typer/felles';

/**
 * Sortering skjer server-side - klikk på en kolonne oppdaterer
 * query-parametere og trigger en ny henting av fanens data.
 */
export const useBenkSortering = <Kolonne extends string>(
    aktivSortering: BenkV2Sortering<Kolonne>,
) => {
    const router = useRouter();

    const [sortertKolonne, retning] = aktivSortering.split(',') as [
        Kolonne,
        BenkV2SorteringRetning,
    ];

    const onSortChange = (sortKey?: string) => {
        if (!sortKey) {
            return;
        }

        const nyRetning =
            sortertKolonne === sortKey && retning === BenkV2SorteringRetning.ASC
                ? BenkV2SorteringRetning.DESC
                : BenkV2SorteringRetning.ASC;

        router.push({
            query: { ...router.query, sortering: `${sortKey},${nyRetning}` },
        });
    };

    return {
        sort: {
            orderBy: sortertKolonne,
            direction:
                retning === BenkV2SorteringRetning.ASC
                    ? ('ascending' as const)
                    : ('descending' as const),
        },
        onSortChange,
    };
};
