import { describe, expect, test } from '@jest/globals';
import { BENK_MINE_TAB, BenkTab } from '../typer/tabs';
import {
    BenkLagredeValg,
    benkLagredeValgTilQuery,
    byggBenkLagredeValg,
    harBenkLagredeFiltre,
    parseBenkCookie,
} from './benkCookie';

const lagredeValg = (valg: Partial<BenkLagredeValg> = {}): BenkLagredeValg => ({
    tab: BenkTab.SØKNADER,
    saksbehandler: null,
    skjulPåVent: false,
    skjulEgneTilBeslutning: false,
    filtre: {},
    ...valg,
});

describe('lagrede valg for mine-fanen', () => {
    test('et lagret saksbehandlervalg gjenopprettes ikke i mine-fanen, som ikke har filteret', () => {
        const valg = lagredeValg({ saksbehandler: 'Z123456' });

        // Ellers ville serveren redirectet til en url mine-fanen ikke leser saksbehandler fra - i det uendelige
        expect(harBenkLagredeFiltre(valg, BENK_MINE_TAB)).toBe(false);
        expect(benkLagredeValgTilQuery(valg, BENK_MINE_TAB)).toEqual({ tab: BENK_MINE_TAB });

        expect(harBenkLagredeFiltre(valg, BenkTab.SØKNADER)).toBe(true);
        expect(benkLagredeValgTilQuery(valg, BenkTab.SØKNADER)).toEqual({
            tab: BenkTab.SØKNADER,
            saksbehandler: 'Z123456',
        });
    });

    test('mine-fanen gjenoppretter seksjonen og avkrysningene', () => {
        const valg = lagredeValg({
            saksbehandler: 'Z123456',
            skjulPåVent: true,
            filtre: { [BENK_MINE_TAB]: { seksjon: BenkTab.KLAGE } },
        });

        expect(harBenkLagredeFiltre(valg, BENK_MINE_TAB)).toBe(true);
        expect(benkLagredeValgTilQuery(valg, BENK_MINE_TAB)).toEqual({
            tab: BENK_MINE_TAB,
            seksjon: BenkTab.KLAGE,
            skjulPåVent: 'true',
        });
    });

    test('mine-fanen beholder saksbehandlervalget til de andre fanene', () => {
        const forrige = lagredeValg({ saksbehandler: 'Z123456' });

        const valg = byggBenkLagredeValg(forrige, BENK_MINE_TAB, {
            seksjon: BenkTab.MELDEKORT,
            skjulPåVent: true,
            skjulEgneTilBeslutning: false,
        });

        expect(valg).toEqual({
            tab: BENK_MINE_TAB,
            saksbehandler: 'Z123456',
            skjulPåVent: true,
            skjulEgneTilBeslutning: false,
            filtre: { [BENK_MINE_TAB]: { seksjon: BenkTab.MELDEKORT } },
        });
    });

    test('en køfane uten saksbehandlervalg fjerner det lagrede valget', () => {
        const forrige = lagredeValg({ saksbehandler: 'Z123456' });

        const valg = byggBenkLagredeValg(forrige, BenkTab.KLAGE, {
            saksbehandler: null,
            skjulPåVent: false,
            skjulEgneTilBeslutning: false,
            status: null,
            resultat: null,
        });

        expect(valg.saksbehandler).toBeNull();
    });

    test('cookien tolker mine-fanen og forkaster en ugyldig seksjon', () => {
        const cookie = JSON.stringify({
            tab: BENK_MINE_TAB,
            filtre: {
                [BENK_MINE_TAB]: { seksjon: BENK_MINE_TAB, saksbehandler: 'Z123456' },
                [BenkTab.KLAGE]: { status: 'UNDER_BEHANDLING' },
            },
        });

        expect(parseBenkCookie(cookie)).toEqual({
            tab: BENK_MINE_TAB,
            saksbehandler: null,
            skjulPåVent: false,
            skjulEgneTilBeslutning: false,
            filtre: { [BenkTab.KLAGE]: { status: 'UNDER_BEHANDLING', resultat: null } },
        });
    });
});
