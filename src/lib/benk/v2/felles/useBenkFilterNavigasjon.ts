import { useRouter } from 'next/router';
import { BenkV2Tab } from '../typer/tabs';
import {
    BenkV2FilterMap,
    benkFilterTilQuery,
    harBenkFilterVerdier,
    benkStrengVerdi,
} from '../utils/benkV2Query';
import { nullstillBenkLagretFilter } from '../utils/benkV2Cookie';

/**
 * Filtrering skjer server-side: valgte filtre legges i URL-en, som igjen
 * trigger en ny henting mot backend. Serveren lagrer valgene i en cookie, mens
 * nullstilling må tømme cookien klientsiden før navigering - ellers ville
 * serveren gjenopprettet filtrene brukeren nettopp fjernet.
 */
export const useBenkFilterNavigasjon = <T extends BenkV2Tab>(tab: T) => {
    const router = useRouter();

    const naviger = (filter: BenkV2FilterMap[T]) => {
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
        nullstillFilter: (tomtFilter: BenkV2FilterMap[T]) => {
            nullstillBenkLagretFilter(tab);
            return naviger(tomtFilter);
        },
    };
};
