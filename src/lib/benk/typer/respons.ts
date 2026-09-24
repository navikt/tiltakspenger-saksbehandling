import { Nullable } from '~/types/UtilTypes';
import { BenkOversikt } from './felles';
import { BENK_MINE_TAB, BenkSideTab, BenkTab } from './tabs';
import { BenkFaneBehandling } from './benkside';

/**
 * Svaret fra fanens rute under /benk, diskriminert på [harTilgang].
 *
 * Uten tilgang er hele svaret kun { harTilgang: false } - backend returnerer
 * ingen benkdata til saksbehandlere uten en rolle som gir tilgang.
 *
 * Med tilgang inneholder svaret fanen det ble spurt om og antallet i alle
 * fanene (til fanetitlene). [error] er satt når requesten ikke lot seg tolke
 * (ukjent fane i url-en eller ugyldige filterverdier) og backend derfor svarte
 * med en standardvisning.
 */
export type BenkRespons<Behandling> = BenkResponsUtenTilgang | BenkResponsMedTilgang<Behandling>;

export type BenkResponsUtenTilgang = {
    harTilgang: false;
};

export type BenkResponsMedTilgang<Behandling> = {
    harTilgang: true;
    tab: BenkTab;
    antallPerTab: Record<BenkSideTab, number>;
    oversikt: BenkOversikt<Behandling>;
    error: Nullable<string>;
};

/**
 * Svaret fra mine-fanen: én oversikt per fane, med behandlingene tildelt den innloggede.
 * Hver oversikt har samme format som fanens egen, men pagineres ikke - `side` er alltid 0.
 * Seksjonene som er filtrert bort, er utelatt.
 */
export type BenkMineRespons = BenkResponsUtenTilgang | BenkMineResponsMedTilgang;

export type BenkMineResponsMedTilgang = {
    harTilgang: true;
    tab: typeof BENK_MINE_TAB;
    antallPerTab: Record<BenkSideTab, number>;
    seksjoner: { [T in BenkTab]?: BenkOversikt<BenkFaneBehandling<T>> };
    error: Nullable<string>;
};
