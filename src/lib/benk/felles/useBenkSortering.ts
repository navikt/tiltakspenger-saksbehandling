import type { ParsedUrlQuery } from 'querystring';
import { useRouter } from 'next/router';
import { BenkSortering, BenkSorteringRetning } from '../typer/felles';
import { benkSorteringNøkkel, splittBenkSortering } from '../utils/benkSortering';

/**
 * Sortering skjer server-side - klikk på en kolonne oppdaterer
 * query-parametere og trigger en ny henting av fanens data.
 * [seksjon] gir tabellen sin egen sortering i url-en, for sidene med flere tabeller (mine-fanen).
 */
export const useBenkSortering = <Kolonne extends string>(
    aktivSortering: BenkSortering<Kolonne>,
    seksjon?: string,
) => {
    const router = useRouter();

    const { kolonne: sortertKolonne, retning } = splittBenkSortering(aktivSortering);

    const onSortChange = (sortKey?: string) => {
        if (!sortKey) {
            return;
        }

        const nyRetning =
            sortertKolonne === sortKey && retning === BenkSorteringRetning.ASC
                ? BenkSorteringRetning.DESC
                : BenkSorteringRetning.ASC;

        // Ny sortering endrer rekkefølgen på radene - start på første side igjen
        const query: ParsedUrlQuery = {
            ...router.query,
            [benkSorteringNøkkel(seksjon)]: `${sortKey},${nyRetning}`,
        };
        delete query.side;

        router.push({ query });
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
