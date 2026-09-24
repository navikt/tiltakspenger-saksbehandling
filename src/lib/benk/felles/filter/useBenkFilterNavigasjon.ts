import { useRouter } from 'next/router';
import { BenkSideTab } from '../../typer/tabs';
import { BenkFilter } from '../../typer/felles';
import { benkFilterTilQuery, harBenkFilterVerdier } from '../../utils/benkQuery';
import { benkSorteringQuery } from '../../utils/benkSortering';
import { nullstillBenkLagretFilter } from '../../utils/benkCookie';
import { tomtBenkSideFilter } from '../../benkFaner';

/**
 * Filtrering skjer server-side: valgte filtre legges i URL-en, som igjen
 * trigger en ny henting mot backend. Serveren lagrer valgene i en cookie, mens
 * nullstilling må tømme cookien klientsiden før navigering - ellers ville
 * serveren gjenopprettet filtrene brukeren nettopp fjernet.
 */
export const useBenkFilterNavigasjon = (tab: BenkSideTab) => {
    const router = useRouter();

    const naviger = (filter: BenkFilter) => {
        // Tomme verdier faller ut av URL-en - uten noen parametere igjen må cookien
        // tømmes før navigering, ellers gjenoppretter serveren de gamle filtrene
        if (!harBenkFilterVerdier(filter)) {
            nullstillBenkLagretFilter(tab);
        }

        return router.push({
            query: {
                tab,
                ...benkSorteringQuery(router.query),
                ...benkFilterTilQuery(filter),
            },
        });
    };

    return {
        oppdaterFilter: naviger,
        nullstillFilter: () => {
            nullstillBenkLagretFilter(tab);
            return naviger(tomtBenkSideFilter(tab));
        },
    };
};
