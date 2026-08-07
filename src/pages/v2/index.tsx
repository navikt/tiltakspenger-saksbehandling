import { ParsedUrlQuery } from 'node:querystring';
import { pageWithAuthentication } from '~/auth/pageWithAuthentication';
import { BenkSideV2, BenkSideV2Props, BenkV2TabData } from '~/lib/benk/v2/BenkSideV2';
import { BENK_V2_TAB_DEFAULT, BenkV2Tab, erBenkV2Tab } from '~/lib/benk/v2/typer/tabs';
import { BenkSøknaderKolonne } from '~/lib/benk/v2/typer/søknader';
import { BenkRevurderingerKolonne } from '~/lib/benk/v2/typer/revurderinger';
import { BenkMeldekortKolonne } from '~/lib/benk/v2/typer/meldekort';
import { BenkKlageKolonne } from '~/lib/benk/v2/typer/klage';
import { BenkTilbakekrevingKolonne } from '~/lib/benk/v2/typer/tilbakekreving';
import {
    hentAntallPerTab,
    hentKlageOversikt,
    hentMeldekortOversikt,
    hentRevurderingerOversikt,
    hentSøknaderOversikt,
    hentTilbakekrevingOversikt,
} from '~/lib/benk/v2/mock/mockBenkService';
import { parseSortering } from '~/lib/benk/v2/benkV2Utils';
import {
    harFilterVerdier,
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
    const tabData = hentTabData(tab, query);

    const redirect = hentRedirect(tabFraQuery, tabData, lagredeValg, query);

    if (redirect) {
        return redirect;
    }

    res.setHeader(
        'Set-Cookie',
        serialiserBenkV2Cookie(byggLagredeValg(lagredeValg, tab, tabData.data.aktivtFilter)),
    );

    return {
        props: {
            antallPerTab: hentAntallPerTab(),
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
    tabData: BenkV2TabData,
    lagredeValg: BenkV2LagredeValg | null,
    query: ParsedUrlQuery,
) => {
    if (harFilterVerdier(tabData.data.aktivtFilter) || lagredeValg === null) {
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
 * Henter data for én fane. Når backend er klar byttes kallene til mock-servicen
 * ut med ekte API-kall - request-typene er ment å speile det fremtidige API-et.
 */
const hentTabData = (tab: BenkV2Tab, query: ParsedUrlQuery): BenkV2TabData => {
    const sorteringFraQuery = strengVerdi(query.sortering);

    switch (tab) {
        case BenkV2Tab.SØKNADER: {
            const filters = parseSøknaderFilter(query);
            const sortering = parseSortering(
                sorteringFraQuery,
                BenkSøknaderKolonne,
                BenkSøknaderKolonne.kravtidspunkt,
            );
            return {
                tab,
                data: {
                    oversikt: hentSøknaderOversikt({ sortering, filters }),
                    aktivtFilter: filters,
                    aktivSortering: sortering,
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
            return {
                tab,
                data: {
                    oversikt: hentRevurderingerOversikt({ sortering, filters }),
                    aktivtFilter: filters,
                    aktivSortering: sortering,
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
            return {
                tab,
                data: {
                    oversikt: hentMeldekortOversikt({ sortering, filters }),
                    aktivtFilter: filters,
                    aktivSortering: sortering,
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
            return {
                tab,
                data: {
                    oversikt: hentKlageOversikt({ sortering, filters }),
                    aktivtFilter: filters,
                    aktivSortering: sortering,
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
            return {
                tab,
                data: {
                    oversikt: hentTilbakekrevingOversikt({ sortering, filters }),
                    aktivtFilter: filters,
                    aktivSortering: sortering,
                },
            };
        }
    }
};

export default BenkSideV2;
