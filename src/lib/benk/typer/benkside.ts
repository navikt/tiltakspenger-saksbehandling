import { Nullable } from '~/types/UtilTypes';
import { BenkOversikt, BenkSortering } from './felles';
import { BenkTab } from './tabs';
import { BenkSøknaderFilter, BenkSøknaderKolonne, BenkSøknadsbehandling } from './søknader';
import {
    BenkRevurderingerFilter,
    BenkRevurderingerKolonne,
    BenkRevurdering,
} from './revurderinger';
import { BenkMeldekort, BenkMeldekortFilter, BenkMeldekortKolonne } from './meldekort';
import { BenkKlagebehandling, BenkKlageFilter, BenkKlageKolonne } from './klage';
import {
    BenkTilbakekreving,
    BenkTilbakekrevingFilter,
    BenkTilbakekrevingKolonne,
} from './tilbakekreving';

/** Radtypen, filteret og de sorterbare kolonnene for hver fane */
export type BenkFaneTyper = {
    [BenkTab.SØKNADER]: {
        behandling: BenkSøknadsbehandling;
        filter: BenkSøknaderFilter;
        kolonne: BenkSøknaderKolonne;
    };
    [BenkTab.REVURDERINGER]: {
        behandling: BenkRevurdering;
        filter: BenkRevurderingerFilter;
        kolonne: BenkRevurderingerKolonne;
    };
    [BenkTab.MELDEKORT]: {
        behandling: BenkMeldekort;
        filter: BenkMeldekortFilter;
        kolonne: BenkMeldekortKolonne;
    };
    [BenkTab.KLAGE]: {
        behandling: BenkKlagebehandling;
        filter: BenkKlageFilter;
        kolonne: BenkKlageKolonne;
    };
    [BenkTab.TILBAKEKREVING]: {
        behandling: BenkTilbakekreving;
        filter: BenkTilbakekrevingFilter;
        kolonne: BenkTilbakekrevingKolonne;
    };
};

export type BenkFaneBehandling<T extends BenkTab> = BenkFaneTyper[T]['behandling'];
/**
 * Feltnavnene i filtrene er identiske med query-parameterne, slik at samme
 * parsing kan brukes både for URL-en og for lagrede filtre i cookie.
 */
export type BenkFaneFilter<T extends BenkTab> = BenkFaneTyper[T]['filter'];
export type BenkFaneKolonne<T extends BenkTab> = BenkFaneTyper[T]['kolonne'];

export type BenkFaneData<T extends BenkTab> = {
    oversikt: BenkOversikt<BenkFaneBehandling<T>>;
    aktivtFilter: BenkFaneFilter<T>;
    aktivSortering: BenkSortering<BenkFaneKolonne<T>>;
};

/**
 * Dataene for den aktive fanen. Ligger som ett felt (ikke spredt utover props)
 * slik at diskrimineringen på `tab` bevares gjennom getServerSideProps.
 */
export type BenkTabData = { [T in BenkTab]: { tab: T; data: BenkFaneData<T> } }[BenkTab];

/**
 * TypeScript klarer ikke å se at `{ tab: T, data: BenkFaneData<T> }` for en generisk T
 * er en av variantene i BenkTabData, så sammenstillingen samles her.
 */
export const lagBenkTabData = <T extends BenkTab>(tab: T, data: BenkFaneData<T>): BenkTabData =>
    ({ tab, data }) as BenkTabData;

export type BenkSideProps = {
    antallPerTab: Record<BenkTab, number>;
    tabData: BenkTabData;
    /** Satt når backend ikke kunne tolke requesten og svarte med en standardvisning */
    error: Nullable<string>;
};
