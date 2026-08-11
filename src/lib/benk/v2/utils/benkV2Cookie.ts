import Cookies from 'js-cookie';
import { Nullable } from '~/types/UtilTypes';
import { BenkV2Tab, erBenkV2Tab } from '../typer/tabs';
import {
    BenkV2FilterMap,
    benkBoolskVerdi,
    benkFilterTilQuery,
    harBenkFilterVerdier,
    parseBenkFilterForTab,
    benkStrengVerdi,
} from './benkV2Query';

export const BENK_V2_COOKIE_NAME = 'benkFiltersV2';

/**
 * Filter for én fane, uten de felles valgene (saksbehandler og skjulPåVent).
 * Lagres løst typet; verdiene valideres med fanens egen parser ved innlesing.
 */
type LagretFilter = Record<string, string | boolean | null>;

export type BenkV2LagredeValg = {
    tab: BenkV2Tab;
    /** Saksbehandlerfilteret er felles på tvers av fanene */
    saksbehandler: Nullable<string>;
    /** «Skjul på vent» er felles på tvers av fanene */
    skjulPåVent: boolean;
    filtre: Partial<Record<BenkV2Tab, LagretFilter>>;
};

const tomtValg = (tab: BenkV2Tab): BenkV2LagredeValg => ({
    tab,
    saksbehandler: null,
    skjulPåVent: false,
    filtre: {},
});

/** Fjerner fellesvalgene fra et filter, siden de lagres én gang for alle faner */
const utenFellesValg = (filter: Record<string, unknown>): LagretFilter => {
    return Object.fromEntries(
        Object.entries(filter).filter(
            ([nøkkel]) => nøkkel !== 'saksbehandler' && nøkkel !== 'skjulPåVent',
        ),
    ) as LagretFilter;
};

/**
 * Parser og validerer cookien. Innholdet er brukerkontrollert, så alle verdier
 * valideres med de samme parserne som brukes for query-parametere.
 */
export const parseBenkV2Cookie = (cookieVerdi: string | undefined): BenkV2LagredeValg | null => {
    if (!cookieVerdi) {
        return null;
    }

    try {
        const parsed = JSON.parse(cookieVerdi) as Record<string, unknown>;

        if (!erBenkV2Tab(parsed.tab)) {
            return null;
        }

        const lagredeFiltre =
            typeof parsed.filtre === 'object' && parsed.filtre !== null
                ? (parsed.filtre as Record<string, unknown>)
                : {};

        const filtre: BenkV2LagredeValg['filtre'] = {};

        Object.values(BenkV2Tab).forEach((tab) => {
            const lagret = lagredeFiltre[tab];

            if (typeof lagret !== 'object' || lagret === null) {
                return;
            }

            const filter = utenFellesValg(
                parseBenkFilterForTab(tab, lagret as Record<string, unknown>),
            );

            if (harBenkFilterVerdier(filter)) {
                filtre[tab] = filter;
            }
        });

        return {
            tab: parsed.tab,
            saksbehandler: benkStrengVerdi(parsed.saksbehandler),
            skjulPåVent: benkBoolskVerdi(parsed.skjulPåVent),
            filtre,
        };
    } catch {
        return null;
    }
};

/** Slår sammen gjeldende visning med tidligere lagrede valg for de andre fanene */
export const byggBenkLagredeValg = <T extends BenkV2Tab>(
    forrige: BenkV2LagredeValg | null,
    tab: T,
    filter: BenkV2FilterMap[T],
): BenkV2LagredeValg => {
    const fanensFilter = utenFellesValg(filter);
    const øvrigeFiltre = { ...forrige?.filtre };
    delete øvrigeFiltre[tab];

    return {
        tab,
        saksbehandler: filter.saksbehandler ?? null,
        skjulPåVent: filter.skjulPåVent,
        filtre: harBenkFilterVerdier(fanensFilter)
            ? { ...øvrigeFiltre, [tab]: fanensFilter }
            : øvrigeFiltre,
    };
};

/** Query-parametere som gjenskaper de lagrede valgene for en gitt fane */
export const benkLagredeValgTilQuery = (
    valg: BenkV2LagredeValg,
    tab: BenkV2Tab,
): Record<string, string> => ({
    tab,
    ...benkFilterTilQuery({
        ...valg.filtre[tab],
        saksbehandler: valg.saksbehandler,
        skjulPåVent: valg.skjulPåVent,
    }),
});

/** Har fanen lagrede filtre (inkludert fellesvalgene)? */
export const harBenkLagredeFiltre = (valg: BenkV2LagredeValg | null, tab: BenkV2Tab): boolean =>
    valg !== null &&
    (valg.saksbehandler !== null ||
        valg.skjulPåVent ||
        harBenkFilterVerdier({ ...valg.filtre[tab] }));

/**
 * Har brukeren lagrede valg som avviker fra standardvisningen? Brukes for å
 * unngå unødvendige redirects når ingenting er valgt.
 */
export const harBenkLagredeValg = (
    valg: BenkV2LagredeValg | null,
    standardTab: BenkV2Tab,
): valg is BenkV2LagredeValg =>
    valg !== null && (valg.tab !== standardTab || harBenkLagredeFiltre(valg, valg.tab));

export const serialiserBenkV2Cookie = (valg: BenkV2LagredeValg): string =>
    `${BENK_V2_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(valg))}; Path=/; Max-Age=31536000; SameSite=Lax`;

/**
 * Nullstiller filteret for én fane, samt fellesvalgene.
 *
 * Må gjøres klientsiden før navigering, slik at serveren ikke gjenoppretter
 * filtrene brukeren nettopp fjernet.
 */
export const nullstillBenkLagretFilter = (tab: BenkV2Tab) => {
    const forrige = parseBenkV2Cookie(Cookies.get(BENK_V2_COOKIE_NAME)) ?? tomtValg(tab);
    const øvrigeFiltre = { ...forrige.filtre };
    delete øvrigeFiltre[tab];

    Cookies.set(
        BENK_V2_COOKIE_NAME,
        JSON.stringify({ tab, saksbehandler: null, skjulPåVent: false, filtre: øvrigeFiltre }),
        { expires: 365 },
    );
};
