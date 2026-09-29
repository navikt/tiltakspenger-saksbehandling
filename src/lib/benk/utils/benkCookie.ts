import Cookies from 'js-cookie';
import { BenkSideTab, erBenkSideTab } from '../typer/tabs';
import { BenkGlobaltFilter, benkGlobaleFilterNøkler, BenkFilter } from '../typer/felles';
import { parseBenkSideFilter } from '../benkFaner';
import {
    benkBoolskVerdi,
    benkFilterTilQuery,
    harBenkFilterVerdier,
    BenkFilterKilde,
} from './benkQuery';

export const BENK_COOKIE_NAME = 'benkFiltersV2';

/**
 * De lokale filtrene for én fane, uten de globale. Lagres løst typet;
 * verdiene valideres med fanens egen parser ved innlesing.
 */
type LagretFilter = BenkFilter;

/**
 * De globale filtrene lagres på tvers av fanene. De lokale filtrene lagres bare for fanen
 * brukeren sist var på, og gjenopprettes kun når hen kommer tilbake til den -
 * ved bytte av fane nullstilles de.
 */
export type BenkLagredeValg = BenkGlobaltFilter & {
    tab: BenkSideTab;
    filter: LagretFilter;
};

const tomtValg = (tab: BenkSideTab): BenkLagredeValg => ({
    tab,
    kunTildeltMeg: false,
    skjulPåVent: false,
    skjulEgneTilBeslutning: false,
    filter: {},
});

const erGlobaltFilter = (nøkkel: string): boolean =>
    (benkGlobaleFilterNøkler as ReadonlyArray<string>).includes(nøkkel);

/** Fjerner de globale filtrene fra et filter, siden de lagres én gang for alle faner */
const utenGlobaleFiltre = (filter: BenkFilter): LagretFilter =>
    Object.fromEntries(Object.entries(filter).filter(([nøkkel]) => !erGlobaltFilter(nøkkel)));

const somKilde = (verdi: unknown): BenkFilterKilde =>
    typeof verdi === 'object' && verdi !== null ? (verdi as BenkFilterKilde) : {};

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

        return {
            tab: parsed.tab,
            kunTildeltMeg: benkBoolskVerdi(parsed.kunTildeltMeg),
            skjulPåVent: benkBoolskVerdi(parsed.skjulPåVent),
            skjulEgneTilBeslutning: benkBoolskVerdi(parsed.skjulEgneTilBeslutning),
            filter: utenGlobaleFiltre(parseBenkSideFilter(parsed.tab, somKilde(parsed.filter))),
        };
    } catch {
        return null;
    }
};

/** De lagrede valgene for fanen som vises */
export const byggBenkLagredeValg = (
    tab: BenkSideTab,
    filter: BenkFilter & BenkGlobaltFilter,
): BenkLagredeValg => ({
    tab,
    kunTildeltMeg: filter.kunTildeltMeg,
    skjulPåVent: filter.skjulPåVent,
    skjulEgneTilBeslutning: filter.skjulEgneTilBeslutning,
    filter: utenGlobaleFiltre(filter),
});

/**
 * Filteret de lagrede valgene gir for en gitt fane: de globale filtrene, og de lokale
 * bare hvis de ble lagret for den samme fanen.
 * Parses med fanens egen parser, slik at bare valgene fanen støtter er med.
 */
const lagretFilterForTab = (valg: BenkLagredeValg, tab: BenkSideTab): BenkFilter =>
    parseBenkSideFilter(tab, {
        ...(valg.tab === tab ? valg.filter : {}),
        kunTildeltMeg: valg.kunTildeltMeg,
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

/** Har fanen lagrede filtre (inkludert de globale)? */
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
 * Nullstiller alle de lagrede valgene.
 *
 * Må gjøres klientsiden før navigering, slik at serveren ikke gjenoppretter
 * filtrene brukeren nettopp fjernet.
 */
export const nullstillBenkLagretFilter = (tab: BenkSideTab) => {
    Cookies.set(BENK_COOKIE_NAME, JSON.stringify(tomtValg(tab)), { expires: 365 });
};
