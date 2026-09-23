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
