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
    skjulPåVent: false,
    skjulEgneTilBeslutning: false,
    filter: {},
    ...valg,
});

describe('lagrede valg ved bytte av fane', () => {
    test('nedtrekksvalgene gjenopprettes bare i fanen de ble lagret for', () => {
        const valg = lagredeValg({
            tab: BenkTab.SØKNADER,
            filter: { saksbehandler: 'Z123456', status: 'UNDER_BEHANDLING' },
        });

        expect(benkLagredeValgTilQuery(valg, BenkTab.SØKNADER)).toEqual({
            tab: BenkTab.SØKNADER,
            saksbehandler: 'Z123456',
            status: 'UNDER_BEHANDLING',
        });

        expect(harBenkLagredeFiltre(valg, BenkTab.KLAGE)).toBe(false);
        expect(benkLagredeValgTilQuery(valg, BenkTab.KLAGE)).toEqual({ tab: BenkTab.KLAGE });
    });

    test('avkrysningene beholdes på tvers av fanene, også i mine-fanen', () => {
        const valg = lagredeValg({
            tab: BenkTab.SØKNADER,
            skjulPåVent: true,
            filter: { saksbehandler: 'Z123456' },
        });

        expect(harBenkLagredeFiltre(valg, BENK_MINE_TAB)).toBe(true);
        expect(benkLagredeValgTilQuery(valg, BENK_MINE_TAB)).toEqual({
            tab: BENK_MINE_TAB,
            skjulPåVent: 'true',
        });
        expect(benkLagredeValgTilQuery(valg, BenkTab.MELDEKORT)).toEqual({
            tab: BenkTab.MELDEKORT,
            skjulPåVent: 'true',
        });
    });

    test('mine-fanen gjenoppretter seksjonen når brukeren kommer tilbake til den', () => {
        const valg = byggBenkLagredeValg(BENK_MINE_TAB, {
            seksjon: BenkTab.MELDEKORT,
            skjulPåVent: false,
            skjulEgneTilBeslutning: true,
        });

        expect(valg).toEqual({
            tab: BENK_MINE_TAB,
            skjulPåVent: false,
            skjulEgneTilBeslutning: true,
            filter: { seksjon: BenkTab.MELDEKORT },
        });
        expect(benkLagredeValgTilQuery(valg, BENK_MINE_TAB)).toEqual({
            tab: BENK_MINE_TAB,
            seksjon: BenkTab.MELDEKORT,
            skjulEgneTilBeslutning: 'true',
        });
    });

    test('cookien forkaster valg fanen ikke støtter', () => {
        const cookie = JSON.stringify({
            tab: BENK_MINE_TAB,
            skjulPåVent: true,
            filter: { seksjon: BENK_MINE_TAB, saksbehandler: 'Z123456' },
        });

        // Et saksbehandlervalg i mine-fanen ville gitt en redirect-løkke, siden fanen ikke leser det fra url-en
        expect(parseBenkCookie(cookie)).toEqual({
            tab: BENK_MINE_TAB,
            skjulPåVent: true,
            skjulEgneTilBeslutning: false,
            filter: { seksjon: null },
        });
    });
});
