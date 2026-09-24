import { ComponentType } from 'react';
import { BenkTab } from './typer/tabs';
import { BenkSøknaderFilterSkjema } from './søknader/BenkSøknaderFilterSkjema';
import { BenkSøknaderTabell } from './søknader/BenkSøknaderTabell';
import { BenkRevurderingerFilterSkjema } from './revurderinger/BenkRevurderingerFilterSkjema';
import { BenkRevurderingerTabell } from './revurderinger/BenkRevurderingerTabell';
import { BenkMeldekortFilterSkjema } from './meldekort/BenkMeldekortFilterSkjema';
import { BenkMeldekortTabell } from './meldekort/BenkMeldekortTabell';
import { BenkKlageFilterSkjema } from './klage/BenkKlageFilterSkjema';
import { BenkKlageTabell } from './klage/BenkKlageTabell';
import { BenkTilbakekrevingFilterSkjema } from './tilbakekreving/BenkTilbakekrevingFilterSkjema';
import { BenkTilbakekrevingTabell } from './tilbakekreving/BenkTilbakekrevingTabell';
import { BenkFaneFilterSkjemaProps } from './felles/filter/BenkFilterSkjema';
import { BenkFaneTabellProps } from './felles/tabell/BenkTabell';

type BenkFaneKomponenter<T extends BenkTab> = {
    Filter: ComponentType<BenkFaneFilterSkjemaProps<T>>;
    Tabell: ComponentType<BenkFaneTabellProps<T>>;
};

/** Visningen per fane. Tabellene brukes også av seksjonene i mine-fanen. */
export const benkFaneKomponenter: { [T in BenkTab]: BenkFaneKomponenter<T> } = {
    [BenkTab.SØKNADER]: { Filter: BenkSøknaderFilterSkjema, Tabell: BenkSøknaderTabell },
    [BenkTab.REVURDERINGER]: {
        Filter: BenkRevurderingerFilterSkjema,
        Tabell: BenkRevurderingerTabell,
    },
    [BenkTab.MELDEKORT]: { Filter: BenkMeldekortFilterSkjema, Tabell: BenkMeldekortTabell },
    [BenkTab.KLAGE]: { Filter: BenkKlageFilterSkjema, Tabell: BenkKlageTabell },
    [BenkTab.TILBAKEKREVING]: {
        Filter: BenkTilbakekrevingFilterSkjema,
        Tabell: BenkTilbakekrevingTabell,
    },
};
