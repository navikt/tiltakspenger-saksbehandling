import { ParsedUrlQuery } from 'node:querystring';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { BenkSide, BenkSideProps } from '~/lib/benk/BenkSide';
import { BENK_TAB_DEFAULT, BenkTab, erBenkTab } from '~/lib/benk/typer/tabs';
import { BenkSøknaderKolonne, BenkSøknadsbehandling } from '~/lib/benk/typer/søknader';
import { BenkRevurderingerKolonne, BenkRevurdering } from '~/lib/benk/typer/revurderinger';
import { BenkMeldekortKolonne, BenkMeldekort } from '~/lib/benk/typer/meldekort';
import { BenkKlageKolonne, BenkKlagebehandling } from '~/lib/benk/typer/klage';
import { BenkTilbakekrevingKolonne, BenkTilbakekreving } from '~/lib/benk/typer/tilbakekreving';
import { BenkFilter, BenkSortering } from '~/lib/benk/typer/felles';
import { fetchBenk, NextRequest } from '~/utils/fetch/fetch-server';
import { parseBenkSortering } from '~/lib/benk/utils/benkUtils';
import {
    harBenkFilterVerdier,
    parseBenkFilterForTab,
    parseBenkKlageFilter,
    parseBenkMeldekortFilter,
    parseBenkRevurderingerFilter,
    parseBenkSøknaderFilter,
    parseBenkTilbakekrevingFilter,
    benkStrengVerdi,
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

    const { antallPerTab, tabData, error } = await hentTabData(req, tab, query);

    res.setHeader(
        'Set-Cookie',
        serialiserBenkCookie(byggBenkLagredeValg(lagredeValg, tab, tabData.data.aktivtFilter)),
    );

    return {
        props: {
            antallPerTab,
            tabData,
            error,
        } satisfies BenkSideProps,
    };
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
 * oversikt og antallet i alle fanene, slik at ett kall dekker hele siden.
 */
const hentTabData = async (
    req: NextRequest,
    tab: BenkTab,
    query: ParsedUrlQuery,
): Promise<Pick<BenkSideProps, 'antallPerTab' | 'tabData' | 'error'>> => {
    const sorteringFraQuery = benkStrengVerdi(query.sortering);

    switch (tab) {
        case BenkTab.SØKNADER: {
            const filters = parseBenkSøknaderFilter(query);
            const sortering = parseBenkSortering(
                sorteringFraQuery,
                BenkSøknaderKolonne,
                BenkSøknaderKolonne.kravtidspunkt,
            );
            const { antallPerTab, oversikt, error } = await hentFane<BenkSøknadsbehandling>(
                req,
                tab,
                filters,
                sortering,
            );
            return {
                antallPerTab,
                error,
                tabData: {
                    tab,
                    data: { oversikt, aktivtFilter: filters, aktivSortering: sortering },
                },
            };
        }
        case BenkTab.REVURDERINGER: {
            const filters = parseBenkRevurderingerFilter(query);
            const sortering = parseBenkSortering(
                sorteringFraQuery,
                BenkRevurderingerKolonne,
                BenkRevurderingerKolonne.startet,
            );
            const { antallPerTab, oversikt, error } = await hentFane<BenkRevurdering>(
                req,
                tab,
                filters,
                sortering,
            );
            return {
                antallPerTab,
                error,
                tabData: {
                    tab,
                    data: { oversikt, aktivtFilter: filters, aktivSortering: sortering },
                },
            };
        }
        case BenkTab.MELDEKORT: {
            const filters = parseBenkMeldekortFilter(query);
            const sortering = parseBenkSortering(
                sorteringFraQuery,
                BenkMeldekortKolonne,
                BenkMeldekortKolonne.meldeperioder,
            );
            const { antallPerTab, oversikt, error } = await hentFane<BenkMeldekort>(
                req,
                tab,
                filters,
                sortering,
            );
            return {
                antallPerTab,
                error,
                tabData: {
                    tab,
                    data: { oversikt, aktivtFilter: filters, aktivSortering: sortering },
                },
            };
        }
        case BenkTab.KLAGE: {
            const filters = parseBenkKlageFilter(query);
            const sortering = parseBenkSortering(
                sorteringFraQuery,
                BenkKlageKolonne,
                BenkKlageKolonne.kravtidspunkt,
            );
            const { antallPerTab, oversikt, error } = await hentFane<BenkKlagebehandling>(
                req,
                tab,
                filters,
                sortering,
            );
            return {
                antallPerTab,
                error,
                tabData: {
                    tab,
                    data: { oversikt, aktivtFilter: filters, aktivSortering: sortering },
                },
            };
        }
        case BenkTab.TILBAKEKREVING: {
            const filters = parseBenkTilbakekrevingFilter(query);
            const sortering = parseBenkSortering(
                sorteringFraQuery,
                BenkTilbakekrevingKolonne,
                BenkTilbakekrevingKolonne.startet,
            );
            const { antallPerTab, oversikt, error } = await hentFane<BenkTilbakekreving>(
                req,
                tab,
                filters,
                sortering,
            );
            return {
                antallPerTab,
                error,
                tabData: {
                    tab,
                    data: { oversikt, aktivtFilter: filters, aktivSortering: sortering },
                },
            };
        }
    }
};

const hentFane = <Behandling,>(
    req: NextRequest,
    tab: BenkTab,
    filters: BenkFilter,
    sortering: BenkSortering<string>,
) => fetchBenk<Behandling>(req, tab, { sortering, filters });

export default BenkSide;
