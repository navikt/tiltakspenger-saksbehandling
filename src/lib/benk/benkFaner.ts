import { BenkTab } from './typer/tabs';
import { BenkFaneFilter, BenkFaneKolonne } from './typer/benkside';
import { BenkSøknaderKolonne } from './typer/søknader';
import { BenkRevurderingerKolonne } from './typer/revurderinger';
import { BenkMeldekortKolonne } from './typer/meldekort';
import { BenkKlageKolonne } from './typer/klage';
import { BenkTilbakekrevingKolonne } from './typer/tilbakekreving';
import {
    BenkFilterKilde,
    parseBenkKlageFilter,
    parseBenkMeldekortFilter,
    parseBenkRevurderingerFilter,
    parseBenkSøknaderFilter,
    parseBenkTilbakekrevingFilter,
} from './utils/benkQuery';

type BenkFaneKonfig<T extends BenkTab> = {
    tekst: string;
    /**
     * Sub-path under /benk. Backend har én rute per fane,
     * så fanen angis i url-en i stedet for i body-en.
     */
    path: string;
    parseFilter: (kilde: BenkFilterKilde) => BenkFaneFilter<T>;
    /** Kolonnene fanen kan sorteres på, brukt for å validere sorteringen fra url-en */
    kolonner: Record<string, BenkFaneKolonne<T>>;
    standardSortering: BenkFaneKolonne<T>;
};

/**
 * Alt som skiller fanene fra hverandre utenom visningen, samlet ett sted.
 * Komponentene per fane ligger i BenkSide, slik at denne kan brukes server-side.
 */
export const benkFaner: { [T in BenkTab]: BenkFaneKonfig<T> } = {
    [BenkTab.SØKNADER]: {
        tekst: 'Søknader',
        path: 'soknader',
        parseFilter: parseBenkSøknaderFilter,
        kolonner: BenkSøknaderKolonne,
        standardSortering: BenkSøknaderKolonne.kravtidspunkt,
    },
    [BenkTab.REVURDERINGER]: {
        tekst: 'Revurderinger',
        path: 'revurderinger',
        parseFilter: parseBenkRevurderingerFilter,
        kolonner: BenkRevurderingerKolonne,
        standardSortering: BenkRevurderingerKolonne.startet,
    },
    [BenkTab.MELDEKORT]: {
        tekst: 'Meldekort',
        path: 'meldekort',
        parseFilter: parseBenkMeldekortFilter,
        kolonner: BenkMeldekortKolonne,
        standardSortering: BenkMeldekortKolonne.meldeperioder,
    },
    [BenkTab.KLAGE]: {
        tekst: 'Klage',
        path: 'klage',
        parseFilter: parseBenkKlageFilter,
        kolonner: BenkKlageKolonne,
        standardSortering: BenkKlageKolonne.kravtidspunkt,
    },
    [BenkTab.TILBAKEKREVING]: {
        tekst: 'Tilbakekreving',
        path: 'tilbakekreving',
        parseFilter: parseBenkTilbakekrevingFilter,
        kolonner: BenkTilbakekrevingKolonne,
        standardSortering: BenkTilbakekrevingKolonne.startet,
    },
};

export const parseBenkFilterForTab = <T extends BenkTab>(
    tab: T,
    kilde: BenkFilterKilde,
): BenkFaneFilter<T> => benkFaner[tab].parseFilter(kilde);

/** Filteret uten noen valg - det samme som en url uten filterparametere */
export const tomtBenkFilter = <T extends BenkTab>(tab: T): BenkFaneFilter<T> =>
    parseBenkFilterForTab(tab, {});
