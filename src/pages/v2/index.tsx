import { ParsedUrlQuery } from 'node:querystring';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { BenkSideV2, BenkSideV2Props } from '~/lib/benk/v2/BenkSideV2';
import { BENK_V2_TAB_DEFAULT, BenkV2Tab, erBenkV2Tab } from '~/lib/benk/v2/typer/tabs';
import { BenkSøknaderKolonne, BenkSøknadsbehandling } from '~/lib/benk/v2/typer/søknader';
import { BenkRevurderingerKolonne, BenkRevurdering } from '~/lib/benk/v2/typer/revurderinger';
import { BenkMeldekortKolonne, BenkMeldekort } from '~/lib/benk/v2/typer/meldekort';
import { BenkKlageKolonne, BenkKlagebehandling } from '~/lib/benk/v2/typer/klage';
import { BenkTilbakekrevingKolonne, BenkTilbakekreving } from '~/lib/benk/v2/typer/tilbakekreving';
import { BenkV2Filter } from '~/lib/benk/v2/typer/felles';
import { fetchBenkV2, NextRequest } from '~/utils/fetch/fetch-server';
import { parseSortering } from '~/lib/benk/v2/benkV2Utils';
import {
    harFilterVerdier,
    parseFilterForTab,
    parseKlageFilter,
    parseMeldekortFilter,
    parseRevurderingerFilter,
    parseSøknaderFilter,
    parseTilbakekrevingFilter,
    strengVerdi,
} from '~/lib/benk/v2/benkV2Query';
import {
    BENK_V2_COOKIE_NAME,
    BenkV2LagredeValg,
    byggLagredeValg,
    harLagredeFiltre,
    harLagredeValg,
    lagredeValgTilQuery,
    parseBenkV2Cookie,
    serialiserBenkV2Cookie,
} from '~/lib/benk/v2/benkV2Cookie';

export const getServerSideProps = pageWithAuthentication(async (context) => {
    const { query, req, res } = context;

    const tabFraQuery = erBenkV2Tab(query.tab) ? query.tab : null;
    const tab = tabFraQuery ?? BENK_V2_TAB_DEFAULT;

    const lagredeValg = parseBenkV2Cookie(req.cookies[BENK_V2_COOKIE_NAME]);
    const aktivtFilter = parseFilterForTab(tab, query);

    const redirect = hentRedirect(tabFraQuery, aktivtFilter, lagredeValg, query);

    if (redirect) {
        return redirect;
    }

    const { antallPerTab, tabData } = await hentTabData(req, tab, query);

    res.setHeader(
        'Set-Cookie',
        serialiserBenkV2Cookie(byggLagredeValg(lagredeValg, tab, tabData.data.aktivtFilter)),
    );

    return {
        props: {
            antallPerTab,
            tabData,
        } satisfies BenkSideV2Props,
    };
});

/**
 * Når URL-en ikke inneholder filtre gjenoppretter vi brukerens lagrede valg ved
 * å redirecte med dem som query-parametere, slik at URL-en alltid gjenspeiler
 * det som vises. Nullstilling tømmer cookien klientsiden først, så da skjer det
 * ingen redirect.
 */
const hentRedirect = (
    tabFraQuery: BenkV2Tab | null,
    aktivtFilter: BenkV2Filter,
    lagredeValg: BenkV2LagredeValg | null,
    query: ParsedUrlQuery,
) => {
    if (harFilterVerdier(aktivtFilter) || lagredeValg === null) {
        return null;
    }

    // Uten fane i URL-en gjenoppretter vi både fane og filtre
    const skalGjenopprette =
        tabFraQuery === null
            ? harLagredeValg(lagredeValg, BENK_V2_TAB_DEFAULT)
            : harLagredeFiltre(lagredeValg, tabFraQuery);

    if (!skalGjenopprette) {
        return null;
    }

    const params = new URLSearchParams(
        lagredeValgTilQuery(lagredeValg, tabFraQuery ?? lagredeValg.tab),
    );

    const sortering = strengVerdi(query.sortering);

    if (sortering) {
        params.set('sortering', sortering);
    }

    return {
        redirect: {
            destination: `/v2?${params.toString()}`,
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
    tab: BenkV2Tab,
    query: ParsedUrlQuery,
): Promise<Pick<BenkSideV2Props, 'antallPerTab' | 'tabData'>> => {
    const sorteringFraQuery = strengVerdi(query.sortering);

    switch (tab) {
        case BenkV2Tab.SØKNADER: {
            const filters = parseSøknaderFilter(query);
            const sortering = parseSortering(
                sorteringFraQuery,
                BenkSøknaderKolonne,
                BenkSøknaderKolonne.kravtidspunkt,
            );
            const respons = await fetchBenkV2<BenkSøknadsbehandling>(req, {
                tab,
                sortering,
                filters,
            });
            return {
                antallPerTab: respons.antallPerTab,
                tabData: {
                    tab,
                    data: {
                        oversikt: respons.oversikt,
                        aktivtFilter: filters,
                        aktivSortering: sortering,
                    },
                },
            };
        }
        case BenkV2Tab.REVURDERINGER: {
            const filters = parseRevurderingerFilter(query);
            const sortering = parseSortering(
                sorteringFraQuery,
                BenkRevurderingerKolonne,
                BenkRevurderingerKolonne.startet,
            );
            const respons = await fetchBenkV2<BenkRevurdering>(req, { tab, sortering, filters });
            return {
                antallPerTab: respons.antallPerTab,
                tabData: {
                    tab,
                    data: {
                        oversikt: respons.oversikt,
                        aktivtFilter: filters,
                        aktivSortering: sortering,
                    },
                },
            };
        }
        case BenkV2Tab.MELDEKORT: {
            const filters = parseMeldekortFilter(query);
            const sortering = parseSortering(
                sorteringFraQuery,
                BenkMeldekortKolonne,
                BenkMeldekortKolonne.periode,
            );
            const respons = await fetchBenkV2<BenkMeldekort>(req, { tab, sortering, filters });
            return {
                antallPerTab: respons.antallPerTab,
                tabData: {
                    tab,
                    data: {
                        oversikt: respons.oversikt,
                        aktivtFilter: filters,
                        aktivSortering: sortering,
                    },
                },
            };
        }
        case BenkV2Tab.KLAGE: {
            const filters = parseKlageFilter(query);
            const sortering = parseSortering(
                sorteringFraQuery,
                BenkKlageKolonne,
                BenkKlageKolonne.kravtidspunkt,
            );
            const respons = await fetchBenkV2<BenkKlagebehandling>(req, {
                tab,
                sortering,
                filters,
            });
            return {
                antallPerTab: respons.antallPerTab,
                tabData: {
                    tab,
                    data: {
                        oversikt: respons.oversikt,
                        aktivtFilter: filters,
                        aktivSortering: sortering,
                    },
                },
            };
        }
        case BenkV2Tab.TILBAKEKREVING: {
            const filters = parseTilbakekrevingFilter(query);
            const sortering = parseSortering(
                sorteringFraQuery,
                BenkTilbakekrevingKolonne,
                BenkTilbakekrevingKolonne.startet,
            );
            const respons = await fetchBenkV2<BenkTilbakekreving>(req, { tab, sortering, filters });
            return {
                antallPerTab: respons.antallPerTab,
                tabData: {
                    tab,
                    data: {
                        oversikt: respons.oversikt,
                        aktivtFilter: filters,
                        aktivSortering: sortering,
                    },
                },
            };
        }
    }
};

export default BenkSideV2;
