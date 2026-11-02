import type { Page } from '@playwright/test';
import {
    BenkBehandlingsstatus,
    BenkBehandlingstype,
    BenkTilgangsvurdering,
    BenkTilgangsårsak,
} from '~/lib/benk/typer/felles';
import type { BenkOversikt } from '~/lib/benk/typer/felles';
import type { BenkMineResponsMedTilgang, BenkResponsMedTilgang } from '~/lib/benk/typer/respons';
import type { BenkSøknaderFilter, BenkSøknadsbehandling } from '~/lib/benk/typer/søknader';
import type { BenkRevurdering } from '~/lib/benk/typer/revurderinger';
import { BENK_MINE_TAB, BenkTab } from '~/lib/benk/typer/tabs';
import type { BenkSideTab } from '~/lib/benk/typer/tabs';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { tilSaksnummer } from '~/lib/sak/Saksnummer';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import { expect } from '../felles/e2eFelles';

export const BENK_COOKIE_NAVN = 'benkFiltersV2';

export const lagBenkSøknadsbehandling = (
    overstyringer: Partial<BenkSøknadsbehandling> = {},
): BenkSøknadsbehandling => ({
    type: BenkBehandlingstype.SØKNADSBEHANDLING,
    id: 'beh_benk_1',
    sakId: ikkeSladdet('sak_benk_1'),
    fnr: ikkeSladdet('12345678911'),
    saksnummer: ikkeSladdet(tilSaksnummer('202501011001')),
    startet: '2025-01-02T10:00:00',
    sistEndret: '2025-01-03T10:00:00',
    saksbehandler: null,
    beslutter: null,
    erUnderkjent: false,
    ventestatus: {
        erSattPåVent: false,
        begrunnelse: ikkeSladdet(null),
        frist: null,
        venterTil: null,
    },
    tilgang: { vurdering: BenkTilgangsvurdering.HAR_TILGANG, grunn: null },
    personmarkører: { skjermet: false, kode6: false, kode7: false },
    status: BenkBehandlingsstatus.KLAR_TIL_BEHANDLING,
    søknadstype: 'DIGITAL',
    kravtidspunkt: '2025-01-01T08:00:00',
    resultat: SøknadsbehandlingResultat.IKKE_VALGT,
    prioritering: null,
    gyldigeKommandoer: [],
    ...overstyringer,
});

/** En rad saksbehandleren ikke har tilgang til - backend sladder da identifikatorene */
export const lagBenkSøknadsbehandlingUtenTilgang = (
    overstyringer: Partial<BenkSøknadsbehandling> = {},
): BenkSøknadsbehandling =>
    lagBenkSøknadsbehandling({
        id: 'beh_benk_skjermet',
        sakId: sladdet,
        fnr: sladdet,
        saksnummer: sladdet,
        tilgang: {
            vurdering: BenkTilgangsvurdering.HAR_IKKE_TILGANG,
            grunn: { årsak: BenkTilgangsårsak.SKJERMET, begrunnelse: 'Skjermet person' },
        },
        personmarkører: { skjermet: true, kode6: false, kode7: false },
        ...overstyringer,
    });

export const lagBenkRevurdering = (
    overstyringer: Partial<BenkRevurdering> = {},
): BenkRevurdering => ({
    type: BenkBehandlingstype.REVURDERING,
    id: 'beh_benk_rev_1',
    sakId: ikkeSladdet('sak_benk_2'),
    fnr: ikkeSladdet('22222222222'),
    saksnummer: ikkeSladdet(tilSaksnummer('202501011002')),
    startet: '2025-02-02T10:00:00',
    sistEndret: '2025-02-03T10:00:00',
    saksbehandler: null,
    beslutter: null,
    erUnderkjent: false,
    ventestatus: {
        erSattPåVent: false,
        begrunnelse: ikkeSladdet(null),
        frist: null,
        venterTil: null,
    },
    tilgang: { vurdering: BenkTilgangsvurdering.HAR_TILGANG, grunn: null },
    personmarkører: { skjermet: false, kode6: false, kode7: false },
    status: BenkBehandlingsstatus.KLAR_TIL_BEHANDLING,
    resultat: null,
    prioritering: null,
    gyldigeKommandoer: [],
    ...overstyringer,
});

export const lagBenkOversikt = <T>(
    behandlinger: T[],
    overstyringer: Partial<BenkOversikt<T>> = {},
): BenkOversikt<T> => ({
    behandlinger,
    totalAntall: behandlinger.length,
    totalAntallUfiltrert: behandlinger.length,
    oppsummering: {
        antallMedTilgang: behandlinger.length,
        antallUtenTilgang: 0,
        antallSkjermet: 0,
        antallKode6: 0,
        antallKode7: 0,
    },
    side: 0,
    sideantall: 50,
    saksbehandlere: [],
    besluttere: [],
    ...overstyringer,
});

export const lagAntallPerTab = (
    overstyringer: Partial<Record<BenkSideTab, number>> = {},
): Record<BenkSideTab, number> => ({
    [BENK_MINE_TAB]: 0,
    [BenkTab.SØKNADER]: 0,
    [BenkTab.REVURDERINGER]: 0,
    [BenkTab.MELDEKORT]: 0,
    [BenkTab.KLAGE]: 0,
    [BenkTab.TILBAKEKREVING]: 0,
    ...overstyringer,
});

export const lagBenkRespons = <T>(
    tab: BenkTab,
    oversikt: BenkOversikt<T>,
    overstyringer: Partial<BenkResponsMedTilgang<T>> = {},
): BenkResponsMedTilgang<T> => ({
    harTilgang: true,
    tab,
    antallPerTab: lagAntallPerTab({ [tab]: oversikt.totalAntall }),
    oversikt,
    error: null,
    ...overstyringer,
});

export const lagBenkMineRespons = (
    seksjoner: BenkMineResponsMedTilgang['seksjoner'],
    overstyringer: Partial<BenkMineResponsMedTilgang> = {},
): BenkMineResponsMedTilgang => ({
    harTilgang: true,
    tab: BENK_MINE_TAB,
    antallPerTab: lagAntallPerTab(),
    seksjoner,
    error: null,
    ...overstyringer,
});

/** Filteret frontend sender til backend for søknadsfanen uten noen valg (kunTildeltMeg sendes aldri) */
export const standardSøknaderFilter = (
    overstyringer: Partial<Omit<BenkSøknaderFilter, 'kunTildeltMeg'>> = {},
): Omit<BenkSøknaderFilter, 'kunTildeltMeg'> => ({
    skjulPåVent: false,
    skjulEgneTilBeslutning: false,
    beskyttelse: null,
    saksbehandler: null,
    status: null,
    resultat: null,
    søknadstype: null,
    ...overstyringer,
});

/** Query-parameterne i URL-en, dekodet */
export const hentQuery = (page: Page): Record<string, string> =>
    Object.fromEntries(new URL(page.url()).searchParams.entries());

/** Venter til URL-en er på benken med akkurat disse query-parameterne */
export const forventBenkQuery = async (page: Page, forventet: Record<string, string>) =>
    expect
        .poll(() => ({ pathname: new URL(page.url()).pathname, query: hentQuery(page) }))
        .toEqual({ pathname: '/', query: forventet });

export const settBenkCookie = async (page: Page, verdi: Record<string, unknown>, baseURL: string) =>
    page.context().addCookies([
        {
            name: BENK_COOKIE_NAVN,
            value: encodeURIComponent(JSON.stringify(verdi)),
            url: baseURL,
        },
    ]);
