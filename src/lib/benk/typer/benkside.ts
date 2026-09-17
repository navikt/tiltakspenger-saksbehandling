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

type SøknaderData = {
    oversikt: BenkOversikt<BenkSøknadsbehandling>;
    aktivtFilter: BenkSøknaderFilter;
    aktivSortering: BenkSortering<BenkSøknaderKolonne>;
};

type RevurderingerData = {
    oversikt: BenkOversikt<BenkRevurdering>;
    aktivtFilter: BenkRevurderingerFilter;
    aktivSortering: BenkSortering<BenkRevurderingerKolonne>;
};

type MeldekortData = {
    oversikt: BenkOversikt<BenkMeldekort>;
    aktivtFilter: BenkMeldekortFilter;
    aktivSortering: BenkSortering<BenkMeldekortKolonne>;
};

type KlageData = {
    oversikt: BenkOversikt<BenkKlagebehandling>;
    aktivtFilter: BenkKlageFilter;
    aktivSortering: BenkSortering<BenkKlageKolonne>;
};

type TilbakekrevingData = {
    oversikt: BenkOversikt<BenkTilbakekreving>;
    aktivtFilter: BenkTilbakekrevingFilter;
    aktivSortering: BenkSortering<BenkTilbakekrevingKolonne>;
};

/**
 * Dataene for den aktive fanen. Ligger som ett felt (ikke spredt utover props)
 * slik at diskrimineringen på `tab` bevares gjennom getServerSideProps.
 */
export type BenkTabData =
    | { tab: BenkTab.SØKNADER; data: SøknaderData }
    | { tab: BenkTab.REVURDERINGER; data: RevurderingerData }
    | { tab: BenkTab.MELDEKORT; data: MeldekortData }
    | { tab: BenkTab.KLAGE; data: KlageData }
    | { tab: BenkTab.TILBAKEKREVING; data: TilbakekrevingData };

export type BenkSideProps = {
    antallPerTab: Record<BenkTab, number>;
    tabData: BenkTabData;
    /** Satt når backend ikke kunne tolke requesten og svarte med en standardvisning */
    error: Nullable<string>;
};
