import { Nullable } from '~/types/UtilTypes';
import { BenkFellesFilter, BenkOversikt, BenkSortering } from './felles';
import { BenkTab } from './tabs';
import { BenkFaneBehandling, BenkFaneKolonne } from './benkside';

/**
 * Filteret i mine-fanen. Fanen er alltid avgrenset til den innloggede, så den har ikke saksbehandlerfilteret.
 * [seksjon] viser bare behandlingene fra én av fanene - null viser alle.
 */
export type BenkMineFilter = Omit<BenkFellesFilter, 'saksbehandler'> & {
    seksjon: Nullable<BenkTab>;
};

/** En seksjon i mine-fanen: fanens behandlinger tildelt den innloggede, vist i fanens egen tabell */
export type BenkMineSeksjon<T extends BenkTab> = {
    oversikt: BenkOversikt<BenkFaneBehandling<T>>;
    aktivSortering: BenkSortering<BenkFaneKolonne<T>>;
};

/** Seksjonene backend svarte med, per fane. Backend utelater seksjonene som er filtrert bort. */
export type BenkMineSeksjoner = { [T in BenkTab]?: BenkMineSeksjon<T> };

export type BenkMineData = {
    seksjoner: BenkMineSeksjoner;
    aktivtFilter: BenkMineFilter;
};

/** Sorteringen er per seksjon, fordi hver seksjon er en tabell med fanens egne kolonner */
export type BenkMineRequestBody = {
    sortering: { [T in BenkTab]?: BenkSortering<BenkFaneKolonne<T>> };
    filters: BenkMineFilter;
};
