import { ParsedUrlQuery } from 'node:querystring';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { BenkSide } from '~/lib/benk/BenkSide';
import { BenkFaneBehandling, BenkSideProps, lagBenkTabData } from '~/lib/benk/typer/benkside';
import { BENK_TAB_DEFAULT, BenkTab, erBenkTab } from '~/lib/benk/typer/tabs';
import { BenkFilter } from '~/lib/benk/typer/felles';
import { fetchBenk, NextRequest } from '~/utils/fetch/fetch-server';
import { parseBenkSortering } from '~/lib/benk/utils/benkSortering';
import { benkFaner, parseBenkFilterForTab } from '~/lib/benk/benkFaner';
import { harBenkFilterVerdier, benkStrengVerdi, parseBenkSide } from '~/lib/benk/utils/benkQuery';
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

    const tabFraQuery = erBenkTab(query.tab) ? query.tab : null;
    const tab = tabFraQuery ?? BENK_TAB_DEFAULT;

    const lagredeValg = parseBenkCookie(req.cookies[BENK_COOKIE_NAME]);
    const aktivtFilter = parseBenkFilterForTab(tab, query);

    const redirect = hentRedirect(tabFraQuery, aktivtFilter, lagredeValg, query);

    if (redirect) {
        return redirect;
    }

    const sideData = await hentTabData(req, tab, query);

    if (sideData.harTilgang) {
        res.setHeader(
            'Set-Cookie',
            serialiserBenkCookie(
                byggBenkLagredeValg(lagredeValg, tab, sideData.tabData.data.aktivtFilter),
            ),
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
    tabFraQuery: BenkTab | null,
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

    const params = new URLSearchParams(
        benkLagredeValgTilQuery(lagredeValg, tabFraQuery ?? lagredeValg.tab),
    );

    const sortering = benkStrengVerdi(query.sortering);

    if (sortering) {
        params.set('sortering', sortering);
    }

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

export default BenkSideOuter;
