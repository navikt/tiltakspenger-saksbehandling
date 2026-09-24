import type { ParsedUrlQuery } from 'querystring';
import { isValueInRecord } from '~/utils/object';
import { BenkSortering, BenkSorteringRetning } from '../typer/felles';

export const parseBenkSortering = <Kolonne extends string>(
    sortering: string | null,
    kolonner: Record<string, Kolonne>,
    fallbackKolonne: Kolonne,
): BenkSortering<Kolonne> => {
    const [kolonne, retning] = sortering?.split(',') ?? [];

    const gyldigKolonne = isValueInRecord(kolonne, kolonner) ? kolonne : fallbackKolonne;
    const gyldigRetning =
        retning === BenkSorteringRetning.DESC
            ? BenkSorteringRetning.DESC
            : BenkSorteringRetning.ASC;

    return `${gyldigKolonne},${gyldigRetning}`;
};

/** Deler en allerede validert sortering i kolonne og retning */
export const splittBenkSortering = <Kolonne extends string>(
    sortering: BenkSortering<Kolonne>,
): { kolonne: Kolonne; retning: BenkSorteringRetning } => {
    const [kolonne, retning] = sortering.split(',') as [Kolonne, BenkSorteringRetning];
    return { kolonne, retning };
};

/** Query-nøkkelen for sorteringen. Mine-fanen har én per seksjon, siden hver seksjon er en egen tabell. */
export const benkSorteringNøkkel = (seksjon?: string): string =>
    seksjon ? `sortering-${seksjon}` : 'sortering';

/** Sorteringene i url-en - både fanens og seksjonenes - slik at de kan tas med videre ved navigering */
export const benkSorteringQuery = (query: ParsedUrlQuery): Record<string, string> =>
    Object.fromEntries(
        Object.entries(query).filter(
            (entry): entry is [string, string] =>
                (entry[0] === 'sortering' || entry[0].startsWith('sortering-')) &&
                typeof entry[1] === 'string' &&
                entry[1].length > 0,
        ),
    );
