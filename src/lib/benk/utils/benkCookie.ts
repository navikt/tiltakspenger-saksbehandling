import Cookies from 'js-cookie';
import { BENK_MINE_TAB, BenkSideTab, benkSideTabs, erBenkSideTab } from '../typer/tabs';
import { BenkFellesFilter, benkFellesFilterNøkler, BenkFilter } from '../typer/felles';
import { parseBenkSideFilter } from '../benkFaner';
import {
    benkBoolskVerdi,
    benkFilterTilQuery,
    harBenkFilterVerdier,
    benkStrengVerdi,
    BenkFilterKilde,
} from './benkQuery';

export const BENK_COOKIE_NAME = 'benkFiltersV2';

/**
 * Filter for én fane, uten fellesvalgene (BenkFellesFilter). Lagres løst typet;
 * verdiene valideres med fanens egen parser ved innlesing.
 */
type LagretFilter = BenkFilter;

/**
 * Fellesvalgene lagres én gang, på tvers av fanene - resten av filteret lagres per fane.
 * Mine-fanen har ikke saksbehandlerfilteret, men deler avkrysningene med de andre fanene.
 */
export type BenkLagredeValg = BenkFellesFilter & {
    tab: BenkSideTab;
    filtre: Partial<Record<BenkSideTab, LagretFilter>>;
};

const tomtValg = (tab: BenkSideTab, filtre: BenkLagredeValg['filtre'] = {}): BenkLagredeValg => ({
    tab,
    saksbehandler: null,
    skjulPåVent: false,
    skjulEgneTilBeslutning: false,
    filtre,
});

const erFellesValg = (nøkkel: string): boolean =>
    (benkFellesFilterNøkler as ReadonlyArray<string>).includes(nøkkel);

/** Fjerner fellesvalgene fra et filter, siden de lagres én gang for alle faner */
const utenFellesValg = (filter: BenkFilter): LagretFilter =>
    Object.fromEntries(Object.entries(filter).filter(([nøkkel]) => !erFellesValg(nøkkel)));

/**
 * Parser og validerer cookien. Innholdet er brukerkontrollert, så alle verdier
 * valideres med de samme parserne som brukes for query-parametere.
 */
export const parseBenkCookie = (cookieVerdi: string | undefined): BenkLagredeValg | null => {
    if (!cookieVerdi) {
        return null;
    }

    try {
        const parsed = JSON.parse(cookieVerdi) as Record<string, unknown>;

        if (!erBenkSideTab(parsed.tab)) {
            return null;
        }

        const lagredeFiltre =
            typeof parsed.filtre === 'object' && parsed.filtre !== null
                ? (parsed.filtre as Record<string, unknown>)
                : {};

        const filtre: BenkLagredeValg['filtre'] = {};

        benkSideTabs.forEach((tab) => {
            const lagret = lagredeFiltre[tab];

            if (typeof lagret !== 'object' || lagret === null) {
                return;
            }

            const filter = utenFellesValg(parseBenkSideFilter(tab, lagret as BenkFilterKilde));

            if (harBenkFilterVerdier(filter)) {
                filtre[tab] = filter;
            }
        });

        return {
            tab: parsed.tab,
            saksbehandler: benkStrengVerdi(parsed.saksbehandler),
            skjulPåVent: benkBoolskVerdi(parsed.skjulPåVent),
            skjulEgneTilBeslutning: benkBoolskVerdi(parsed.skjulEgneTilBeslutning),
            filtre,
        };
    } catch {
        return null;
    }
};

/**
 * Slår sammen gjeldende visning med tidligere lagrede valg for de andre fanene.
 * En fane uten saksbehandlerfilteret (mine-fanen) beholder det lagrede valget for de andre fanene.
 */
export const byggBenkLagredeValg = (
    forrige: BenkLagredeValg | null,
    tab: BenkSideTab,
    filter: BenkFilter & Omit<BenkFellesFilter, 'saksbehandler'>,
): BenkLagredeValg => {
    const fanensFilter = utenFellesValg(filter);
    const øvrigeFiltre = { ...forrige?.filtre };
    delete øvrigeFiltre[tab];

    return {
        tab,
        saksbehandler:
            'saksbehandler' in filter
                ? benkStrengVerdi(filter.saksbehandler)
                : (forrige?.saksbehandler ?? null),
        skjulPåVent: filter.skjulPåVent,
        skjulEgneTilBeslutning: filter.skjulEgneTilBeslutning,
        filtre: harBenkFilterVerdier(fanensFilter)
            ? { ...øvrigeFiltre, [tab]: fanensFilter }
            : øvrigeFiltre,
    };
};

/**
 * Filteret de lagrede valgene gir for en gitt fane.
 * Parses med fanens egen parser, slik at bare valgene fanen støtter er med -
 * ellers ville et lagret saksbehandlervalg gitt en redirect-løkke i mine-fanen.
 */
const lagretFilterForTab = (valg: BenkLagredeValg, tab: BenkSideTab): BenkFilter =>
    parseBenkSideFilter(tab, {
        ...valg.filtre[tab],
        saksbehandler: valg.saksbehandler,
        skjulPåVent: valg.skjulPåVent,
        skjulEgneTilBeslutning: valg.skjulEgneTilBeslutning,
    });

/** Query-parametere som gjenskaper de lagrede valgene for en gitt fane */
export const benkLagredeValgTilQuery = (
    valg: BenkLagredeValg,
    tab: BenkSideTab,
): Record<string, string> => ({
    tab,
    ...benkFilterTilQuery(lagretFilterForTab(valg, tab)),
});

/** Har fanen lagrede filtre (inkludert fellesvalgene)? */
export const harBenkLagredeFiltre = (valg: BenkLagredeValg | null, tab: BenkSideTab): boolean =>
    valg !== null && harBenkFilterVerdier(lagretFilterForTab(valg, tab));

/**
 * Har brukeren lagrede valg som avviker fra standardvisningen? Brukes for å
 * unngå unødvendige redirects når ingenting er valgt.
 */
export const harBenkLagredeValg = (
    valg: BenkLagredeValg | null,
    standardTab: BenkSideTab,
): valg is BenkLagredeValg =>
    valg !== null && (valg.tab !== standardTab || harBenkLagredeFiltre(valg, valg.tab));

export const serialiserBenkCookie = (valg: BenkLagredeValg): string =>
    `${BENK_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(valg))}; Path=/; Max-Age=31536000; SameSite=Lax`;

/**
 * Nullstiller filteret for én fane, samt fellesvalgene.
 * Mine-fanen har ikke saksbehandlerfilteret, og lar derfor det lagrede valget stå.
 *
 * Må gjøres klientsiden før navigering, slik at serveren ikke gjenoppretter
 * filtrene brukeren nettopp fjernet.
 */
export const nullstillBenkLagretFilter = (tab: BenkSideTab) => {
    const forrige = parseBenkCookie(Cookies.get(BENK_COOKIE_NAME)) ?? tomtValg(tab);
    const øvrigeFiltre = { ...forrige.filtre };
    delete øvrigeFiltre[tab];

    const nullstilt: BenkLagredeValg = {
        ...tomtValg(tab, øvrigeFiltre),
        saksbehandler: tab === BENK_MINE_TAB ? forrige.saksbehandler : null,
    };

    Cookies.set(BENK_COOKIE_NAME, JSON.stringify(nullstilt), { expires: 365 });
};
