import { ParsedUrlQuery } from 'node:querystring';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { BenkSide } from '~/lib/benk/BenkSide';
import { BenkFaneBehandling, BenkSideProps, lagBenkTabData } from '~/lib/benk/typer/benkside';
import {
    BENK_MINE_TAB,
    BENK_TAB_DEFAULT,
    BenkSideTab,
    BenkTab,
    erBenkSideTab,
} from '~/lib/benk/typer/tabs';
import { BenkMineSeksjoner } from '~/lib/benk/typer/mine';
import { BenkFilter } from '~/lib/benk/typer/felles';
import { fetchBenk, fetchBenkMine, NextRequest } from '~/utils/fetch/fetch-server';
import {
    benkSorteringNøkkel,
    benkSorteringQuery,
    parseBenkSortering,
} from '~/lib/benk/utils/benkSortering';
import { benkFaner, parseBenkSideFilter } from '~/lib/benk/benkFaner';
import {
    harBenkFilterVerdier,
    benkStrengVerdi,
    parseBenkMineFilter,
    parseBenkSide,
} from '~/lib/benk/utils/benkQuery';
import {
    BENK_COOKIE_NAME,
    BenkLagredeValg,
    byggBenkLagredeValg,
    harBenkLagredeFiltre,
    harBenkLagredeValg,
    benkLagredeValgTilQuery,
    parseBenkCookie,
    serialiserBenkCookie,
} from '~/lib/benk/utils/benkCookie';
import { BenkSideUtenTilgang } from '~/lib/benk/uten-tilgang/BenkSideUtenTilgang';

/**
 * Props til benksiden, diskriminert på [harTilgang] slik backend-responsen er.
 * Uten tilgang finnes ingen benkdata å vise.
 */
type Props = { harTilgang: false } | ({ harTilgang: true } & BenkSideProps);

const BenkSideOuter = (props: Props) => {
    return props.harTilgang ? <BenkSide {...props} /> : <BenkSideUtenTilgang />;
};

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const { query, req, res } = context;

    const tabFraQuery = erBenkSideTab(query.tab) ? query.tab : null;
    const tab = tabFraQuery ?? BENK_TAB_DEFAULT;

    const lagredeValg = parseBenkCookie(req.cookies[BENK_COOKIE_NAME]);
    const aktivtFilter = parseBenkSideFilter(tab, query);

    const redirect = hentRedirect(tabFraQuery, aktivtFilter, lagredeValg, query);

    if (redirect) {
        return redirect;
    }

    const sideData =
        tab === BENK_MINE_TAB ? await hentMineData(req, query) : await hentTabData(req, tab, query);

    if (sideData.harTilgang) {
        res.setHeader(
            'Set-Cookie',
            serialiserBenkCookie(byggBenkLagredeValg(tab, sideData.tabData.data.aktivtFilter)),
        );
    }

    return { props: sideData };
});

/**
 * Når URL-en ikke inneholder filtre gjenoppretter vi brukerens lagrede valg ved
 * å redirecte med dem som query-parametere, slik at URL-en alltid gjenspeiler
 * det som vises. Nullstilling tømmer cookien klientsiden først, så da skjer det
 * ingen redirect.
 */
const hentRedirect = (
    tabFraQuery: BenkSideTab | null,
    aktivtFilter: BenkFilter,
    lagredeValg: BenkLagredeValg | null,
    query: ParsedUrlQuery,
) => {
    if (harBenkFilterVerdier(aktivtFilter) || lagredeValg === null) {
        return null;
    }

    // Uten fane i URL-en gjenoppretter vi både fane og filtre
    const skalGjenopprette =
        tabFraQuery === null
            ? harBenkLagredeValg(lagredeValg, BENK_TAB_DEFAULT)
            : harBenkLagredeFiltre(lagredeValg, tabFraQuery);

    if (!skalGjenopprette) {
        return null;
    }

    const params = new URLSearchParams({
        ...benkLagredeValgTilQuery(lagredeValg, tabFraQuery ?? lagredeValg.tab),
        ...benkSorteringQuery(query),
    });

    return {
        redirect: {
            destination: `/?${params.toString()}`,
            permanent: false,
        },
    };
};

/**
 * Henter data for én fane fra backend. Svaret inneholder både fanens
 * oversikt og antallet i alle fanene, slik at ett kall dekker hele siden -
 * med mindre saksbehandleren ikke har tilgang, da er svaret kun { harTilgang: false }.
 */
const hentTabData = async <T extends BenkTab>(
    req: NextRequest,
    tab: T,
    query: ParsedUrlQuery,
): Promise<Props> => {
    const fane = benkFaner[tab];

    const filters = fane.parseFilter(query);
    const sortering = parseBenkSortering(
        benkStrengVerdi(query.sortering),
        fane.kolonner,
        fane.standardSortering,
    );
    const side = parseBenkSide(query.side);

    const respons = await fetchBenk<BenkFaneBehandling<T>>(req, tab, {
        sortering,
        filters,
        side,
    });

    if (!respons.harTilgang) {
        return respons;
    }

    const { antallPerTab, oversikt, error } = respons;

    return {
        harTilgang: true,
        antallPerTab,
        error,
        tabData: lagBenkTabData(tab, {
            oversikt,
            aktivtFilter: filters,
            aktivSortering: sortering,
        }),
    };
};

/**
 * Henter mine-fanen fra backend: én seksjon per fane, hver med sin egen sortering.
 * Seksjonene pagineres ikke.
 */
const hentMineData = async (req: NextRequest, query: ParsedUrlQuery): Promise<Props> => {
    const filters = parseBenkMineFilter(query);
    const sortering = Object.fromEntries(
        Object.values(BenkTab).map((tab) => {
            const fane = benkFaner[tab];
            return [
                tab,
                parseBenkSortering(
                    benkStrengVerdi(query[benkSorteringNøkkel(tab)]),
                    fane.kolonner,
                    fane.standardSortering,
                ),
            ];
        }),
    );

    const respons = await fetchBenkMine(req, { sortering, filters });

    if (!respons.harTilgang) {
        return respons;
    }

    const { antallPerTab, seksjoner, error } = respons;

    const seksjonerMedSortering: BenkMineSeksjoner = Object.fromEntries(
        Object.values(BenkTab).flatMap((tab) => {
            const oversikt = seksjoner[tab];
            return oversikt ? [[tab, { oversikt, aktivSortering: sortering[tab] }]] : [];
        }),
    );

    return {
        harTilgang: true,
        antallPerTab,
        error,
        tabData: {
            tab: BENK_MINE_TAB,
            data: { seksjoner: seksjonerMedSortering, aktivtFilter: filters },
        },
    };
};

export default BenkSideOuter;
