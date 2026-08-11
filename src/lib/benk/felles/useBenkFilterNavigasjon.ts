import { useRouter } from 'next/router';
import { BenkTab } from '../typer/tabs';
import {
    BenkFilterMap,
    benkFilterTilQuery,
    harBenkFilterVerdier,
    benkStrengVerdi,
} from '../utils/benkQuery';
import { nullstillBenkLagretFilter } from '../utils/benkCookie';

/**
 * Filtrering skjer server-side: valgte filtre legges i URL-en, som igjen
 * trigger en ny henting mot backend. Serveren lagrer valgene i en cookie, mens
 * nullstilling må tømme cookien klientsiden før navigering - ellers ville
 * serveren gjenopprettet filtrene brukeren nettopp fjernet.
 */
export const useBenkFilterNavigasjon = <T extends BenkTab>(tab: T) => {
    const router = useRouter();

    const naviger = (filter: BenkFilterMap[T]) => {
        const sortering = benkStrengVerdi(router.query.sortering);

        // Tomme verdier faller ut av URL-en - uten noen parametere igjen må cookien
        // tømmes før navigering, ellers gjenoppretter serveren de gamle filtrene
        if (!harBenkFilterVerdier(filter)) {
            nullstillBenkLagretFilter(tab);
        }

        return router.push({
            query: {
                tab,
                ...(sortering ? { sortering } : {}),
                ...benkFilterTilQuery(filter),
            },
        });
    };

    return {
        oppdaterFilter: naviger,
        nullstillFilter: (tomtFilter: BenkFilterMap[T]) => {
            nullstillBenkLagretFilter(tab);
            return naviger(tomtFilter);
        },
    };
};
