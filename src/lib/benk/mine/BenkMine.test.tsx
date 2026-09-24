/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import { BenkTab } from '../typer/tabs';
import { BenkMineData } from '../typer/mine';
import {
    BenkBehandlingstype,
    BenkOversikt,
    BenkTilgangsvurdering,
    BenkTilgangsårsak,
} from '../typer/felles';
import { BenkKlagebehandling, BenkKlageStatus } from '../typer/klage';
import { BenkMine } from './BenkMine';

const router = {
    query: { tab: 'MINE' },
    pathname: '/',
    asPath: '/?tab=MINE',
    push: jest.fn(async () => true),
    prefetch: jest.fn(async () => undefined),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
} as unknown as NextRouter;

// Uten tilgang er radene sladdet og uten handlinger, så tabellen trenger ingen flere kontekster
const klage: BenkKlagebehandling = {
    type: BenkBehandlingstype.KLAGEBEHANDLING,
    id: 'klage_1' as BenkKlagebehandling['id'],
    sakId: sladdet,
    fnr: sladdet,
    saksnummer: sladdet,
    startet: '2025-01-01T12:00:00',
    sistEndret: '2025-01-02T12:00:00',
    kravtidspunkt: '2025-01-01T12:00:00',
    saksbehandler: 'Z123456',
    beslutter: null,
    erUnderkjent: false,
    ventestatus: { erSattPåVent: false, begrunnelse: ikkeSladdet(null), frist: null },
    tilgang: {
        vurdering: BenkTilgangsvurdering.HAR_IKKE_TILGANG,
        grunn: { årsak: BenkTilgangsårsak.SKJERMET, begrunnelse: 'Skjermet' },
    },
    personmarkører: { skjermet: true, kode6: false, kode7: false },
    status: BenkKlageStatus.UNDER_BEHANDLING,
    resultat: null,
};

const oversikt = <T,>(behandlinger: T[], totalAntall: number): BenkOversikt<T> => ({
    behandlinger,
    totalAntall,
    totalAntallUfiltrert: totalAntall,
    oppsummering: {
        antallMedTilgang: 0,
        antallUtenTilgang: behandlinger.length,
        antallSkjermet: 0,
        antallKode6: 0,
        antallKode7: 0,
    },
    side: 0,
    sideantall: 1,
    saksbehandlere: [],
    besluttere: [],
});

const aktivtFilter = { seksjon: null, skjulPåVent: false, skjulEgneTilBeslutning: false };

const renderMine = (data: BenkMineData, totalAntallUfiltrert: number) =>
    render(
        <RouterContext.Provider value={router}>
            <BenkMine data={data} totalAntallUfiltrert={totalAntallUfiltrert} laster={false} />
        </RouterContext.Provider>,
    );

describe('mine-fanen', () => {
    test('viser bare seksjonene med behandlinger', () => {
        renderMine(
            {
                aktivtFilter,
                seksjoner: {
                    [BenkTab.KLAGE]: { oversikt: oversikt([klage], 1), aktivSortering: 'fnr,ASC' },
                    [BenkTab.MELDEKORT]: {
                        oversikt: oversikt([], 0),
                        aktivSortering: 'periode,ASC',
                    },
                },
            },
            2,
        );

        expect(screen.getByText('Klage (1)')).toBeInTheDocument();
        expect(screen.queryByText(/^Meldekort \(/)).not.toBeInTheDocument();
        expect(
            screen.getByText('1 av totalt 2 behandlinger tildelt deg matcher valgte filtre'),
        ).toBeInTheDocument();
    });

    test('skiller mellom ingen tildelte og ingen som matcher filtrene', () => {
        const { unmount } = renderMine({ aktivtFilter, seksjoner: {} }, 0);
        expect(screen.getByText('Du har ingen åpne behandlinger tildelt deg.')).toBeInTheDocument();
        unmount();

        renderMine({ aktivtFilter, seksjoner: {} }, 2);
        expect(
            screen.getByText('Ingen av behandlingene tildelt deg matcher valgte filtre.'),
        ).toBeInTheDocument();
    });
});
