import { Nullable } from '~/types/UtilTypes';
import { BenkOversikt } from './felles';
import { BenkTab } from './tabs';

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
    antallPerTab: Record<BenkTab, number>;
    oversikt: BenkOversikt<Behandling>;
    error: Nullable<string>;
};
