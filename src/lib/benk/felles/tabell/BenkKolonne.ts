import { ReactNode } from 'react';

/**
 * Én kolonne i en benktabell. Overskrift og celle defineres sammen, slik at de ikke kan komme i utakt.
 * `sortKey` er en del av kontrakten med backend - se BenkSorteringKolonne der.
 */
export type BenkKolonne<Rad, Kolonne extends string> = {
    id: string;
    /** En funksjon får alle radene i tabellen, for overskrifter som handler på dem (f.eks. «Tildel flere») */
    tittel: ReactNode | ((rader: Rad[]) => ReactNode);
    celle: (rad: Rad) => ReactNode;
    /** Kolonnen er sorterbar når den har en sortKey */
    sortKey?: Kolonne;
    align?: 'left' | 'right';
    /** Cellen blir radens overskrift (`<th scope="row">`) */
    erRadoverskrift?: boolean;
    /** Skjules når filteret skjuler behandlinger på vent - da har alle radene uansett samme verdi */
    skjulesNårPåVentErSkjult?: boolean;
};
