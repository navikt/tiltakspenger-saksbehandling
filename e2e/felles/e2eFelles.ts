import pkg from 'next/experimental/testmode/playwright/msw.js';
import type { Page } from '@playwright/test';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import type { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import type { Personopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';
import { tilDato } from '~/types/DatoTid';

/**
 * Felles oppsett for e2e-testene. Next sin testmode-proxy fanger opp alle kall serveren gjør mot
 * backend, slik at de kan besvares med msw-handlere per test.
 */
export const { test, expect, http, HttpResponse } = pkg;

export const SAKSBEHANDLER_IDENT = 'Z123456';
export const BESLUTTER_IDENT = 'Z654321';

export const lagSaksbehandler = (overstyringer: Partial<Saksbehandler> = {}): Saksbehandler => ({
    brukernavn: 'Sara Saksbehandler',
    epost: 'sara.saksbehandler@nav.no',
    navIdent: SAKSBEHANDLER_IDENT,
    roller: [SaksbehandlerRolle.SAKSBEHANDLER],
    sladdes: false,
    kanSeBenken: true,
    ...overstyringer,
});

export const lagBeslutter = (overstyringer: Partial<Saksbehandler> = {}): Saksbehandler =>
    lagSaksbehandler({
        brukernavn: 'Bjørn Beslutter',
        epost: 'bjorn.beslutter@nav.no',
        navIdent: BESLUTTER_IDENT,
        roller: [SaksbehandlerRolle.BESLUTTER],
        ...overstyringer,
    });

export const lagPersonopplysninger = (
    overstyringer: Partial<Personopplysninger> = {},
): Personopplysninger => ({
    fnr: ikkeSladdet('12345678911'),
    fødselsdato: ikkeSladdet(tilDato('1990-01-01')),
    fornavn: ikkeSladdet('Ola'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet('Nordmann'),
    dødsdato: ikkeSladdet(null),
    fortrolig: false,
    strengtFortrolig: false,
    strengtFortroligUtland: false,
    skjermet: false,
    ...overstyringer,
});

/**
 * Handlere som trengs på (nesten) alle sider: innlogget saksbehandler og personaliaheaderen.
 * Legg flyt-spesifikke handlere foran disse i `msw.use(...)` om de skal overstyre.
 */
export const fellesHandlere = (
    innlogget: Saksbehandler = lagSaksbehandler(),
    personopplysninger: Personopplysninger = lagPersonopplysninger(),
) => [
    http.get('*/saksbehandler', () => HttpResponse.json(innlogget)),
    http.get('*/sak/:sakId/personopplysninger', () => HttpResponse.json(personopplysninger)),
];

/** Første sidevisning kan ta tid når serveren er kald. */
export const SIDELAST_TIMEOUT = 60_000;

export const forventOverskrift = async (page: Page, navn: string) =>
    expect(page.getByRole('heading', { name: navn })).toBeVisible({ timeout: SIDELAST_TIMEOUT });
