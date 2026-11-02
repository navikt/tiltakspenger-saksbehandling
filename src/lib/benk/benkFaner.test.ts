import { describe, expect, test } from '@jest/globals';
import {
    benkFaner,
    benkSideTabTekst,
    parseBenkFilterForTab,
    parseBenkSideFilter,
    tomtBenkFilter,
    tomtBenkSideFilter,
} from './benkFaner';
import { BENK_MINE_TAB, BenkTab } from './typer/tabs';
import { parseBenkSortering } from './utils/benkSortering';
import { BenkMeldekortKolonne } from './typer/meldekort';
import { BenkKlageKolonne } from './typer/klage';

const parseSortering = (tab: BenkTab, sortering: string | null) =>
    parseBenkSortering(sortering, benkFaner[tab].kolonner, benkFaner[tab].standardSortering);

describe('sorteringen fra url-en valideres mot fanens kolonner', () => {
    test('alle fanens kolonner godtas i begge retninger', () => {
        Object.values(BenkTab).forEach((tab) => {
            Object.values(benkFaner[tab].kolonner).forEach((kolonne) => {
                expect(parseSortering(tab, `${kolonne},ASC`)).toBe(`${kolonne},ASC`);
                expect(parseSortering(tab, `${kolonne},DESC`)).toBe(`${kolonne},DESC`);
            });
        });
    });

    test('uten sortering brukes fanens standardsortering stigende', () => {
        expect(parseSortering(BenkTab.SØKNADER, null)).toBe('kravtidspunkt,ASC');
        expect(parseSortering(BenkTab.MELDEKORT, '')).toBe('periode,ASC');
    });

    test('ukjent kolonne gir standardkolonnen, men beholder retningen', () => {
        expect(parseSortering(BenkTab.REVURDERINGER, 'finnesIkke,DESC')).toBe('startet,DESC');
    });

    test('kolonner som bare finnes i andre faner godtas ikke', () => {
        // Klager har ingen beslutter, og kravtidspunkt finnes ikke for revurderinger
        expect(parseSortering(BenkTab.KLAGE, 'beslutter,DESC')).toBe(
            `${BenkKlageKolonne.kravtidspunkt},DESC`,
        );
        expect(parseSortering(BenkTab.REVURDERINGER, 'kravtidspunkt,ASC')).toBe('startet,ASC');
    });

    test('url-en bruker sortKey-en backend forventer, ikke navnet på kolonnen i frontend', () => {
        expect(BenkMeldekortKolonne.meldeperioder).toBe('periode');
        expect(parseSortering(BenkTab.MELDEKORT, 'periode,DESC')).toBe('periode,DESC');
        expect(parseSortering(BenkTab.MELDEKORT, 'meldeperioder,DESC')).toBe('periode,DESC');
    });

    test('ukjent eller manglende retning gir stigende', () => {
        expect(parseSortering(BenkTab.SØKNADER, 'fnr')).toBe('fnr,ASC');
        expect(parseSortering(BenkTab.SØKNADER, 'fnr,desc')).toBe('fnr,ASC');
        expect(parseSortering(BenkTab.SØKNADER, 'fnr,TILFELDIG')).toBe('fnr,ASC');
    });
});

describe('filteret per fane', () => {
    test('resultatfilteret godtar bare resultatene fanen har', () => {
        expect(parseBenkFilterForTab(BenkTab.SØKNADER, { resultat: 'INNVILGELSE' }).resultat).toBe(
            'INNVILGELSE',
        );
        expect(
            parseBenkFilterForTab(BenkTab.SØKNADER, { resultat: 'REVURDERING_INNVILGELSE' })
                .resultat,
        ).toBeNull();
        expect(
            parseBenkFilterForTab(BenkTab.REVURDERINGER, { resultat: 'REVURDERING_INNVILGELSE' })
                .resultat,
        ).toBe('REVURDERING_INNVILGELSE');
        expect(
            parseBenkFilterForTab(BenkTab.REVURDERINGER, { resultat: 'INNVILGELSE' }).resultat,
        ).toBeNull();
    });

    test('statusfilteret godtar bare statusene fanen har', () => {
        expect(
            parseBenkFilterForTab(BenkTab.KLAGE, { status: 'KLAR_TIL_FERDIGSTILLING' }).status,
        ).toBe('KLAR_TIL_FERDIGSTILLING');
        expect(
            parseBenkFilterForTab(BenkTab.SØKNADER, { status: 'KLAR_TIL_FERDIGSTILLING' }).status,
        ).toBeNull();
        expect(
            parseBenkFilterForTab(BenkTab.MELDEKORT, { status: 'UNDER_BESLUTNING' }).status,
        ).toBe('UNDER_BESLUTNING');
    });

    test('fanenes egne filtre leses fra url-en og fra cookie-json', () => {
        expect(parseBenkFilterForTab(BenkTab.MELDEKORT, { type: 'INNSENDT_MELDEKORT' }).type).toBe(
            'INNSENDT_MELDEKORT',
        );
        expect(parseBenkFilterForTab(BenkTab.SØKNADER, { søknadstype: 'PAPIR_SKJEMA' })).toEqual(
            expect.objectContaining({ søknadstype: 'PAPIR_SKJEMA' }),
        );
        expect(
            parseBenkFilterForTab(BenkTab.TILBAKEKREVING, {
                kilde: 'MELDEKORT',
                kunOverMinstebeløp: true,
            }),
        ).toEqual(expect.objectContaining({ kilde: 'MELDEKORT', kunOverMinstebeløp: true }));
    });

    test('avkrysninger er bare på for true eller "true"', () => {
        expect(parseBenkFilterForTab(BenkTab.SØKNADER, { skjulPåVent: 'true' }).skjulPåVent).toBe(
            true,
        );
        expect(parseBenkFilterForTab(BenkTab.SØKNADER, { skjulPåVent: true }).skjulPåVent).toBe(
            true,
        );
        expect(parseBenkFilterForTab(BenkTab.SØKNADER, { skjulPåVent: '1' }).skjulPåVent).toBe(
            false,
        );
        expect(parseBenkFilterForTab(BenkTab.SØKNADER, { skjulPåVent: 'TRUE' }).skjulPåVent).toBe(
            false,
        );
    });

    test('saksbehandlerfilteret må være en ikke-tom streng', () => {
        expect(
            parseBenkFilterForTab(BenkTab.KLAGE, { saksbehandler: 'Z123456' }).saksbehandler,
        ).toBe('Z123456');
        expect(
            parseBenkFilterForTab(BenkTab.KLAGE, { saksbehandler: '' }).saksbehandler,
        ).toBeNull();
        expect(
            parseBenkFilterForTab(BenkTab.KLAGE, { saksbehandler: ['Z1', 'Z2'] }).saksbehandler,
        ).toBeNull();
    });

    test('det tomme filteret har ingen aktive valg', () => {
        Object.values(BenkTab).forEach((tab) => {
            Object.values(tomtBenkFilter(tab)).forEach((verdi) => {
                expect([null, false]).toContain(verdi);
            });
        });
    });
});

describe('benksiden med mine-fanen', () => {
    test('mine-fanen har seksjonsfilteret og ikke saksbehandlerfilteret', () => {
        const filter = parseBenkSideFilter(BENK_MINE_TAB, {
            seksjon: 'KLAGE',
            saksbehandler: 'Z123456',
        });

        expect(filter.seksjon).toBe(BenkTab.KLAGE);
        expect(filter).not.toHaveProperty('saksbehandler');
    });

    test('mine-fanen godtar bare faner som seksjon', () => {
        expect(parseBenkSideFilter(BENK_MINE_TAB, { seksjon: 'MINE' }).seksjon).toBeNull();
        expect(parseBenkSideFilter(BENK_MINE_TAB, { seksjon: 'ukjent' }).seksjon).toBeNull();
    });

    test('de andre fanene tar bare med sine egne nøkler', () => {
        const filter = parseBenkSideFilter(BenkTab.SØKNADER, {
            seksjon: 'KLAGE',
            saksbehandler: 'Z123456',
            ukjent: 'verdi',
        });

        expect(filter.saksbehandler).toBe('Z123456');
        expect(filter).not.toHaveProperty('seksjon');
        expect(filter).not.toHaveProperty('ukjent');
    });

    test('det tomme filteret for mine-fanen har ingen aktive valg', () => {
        expect(Object.values(tomtBenkSideFilter(BENK_MINE_TAB)).every((v) => !v)).toBe(true);
    });

    test('fanetitlene inkluderer mine-fanen', () => {
        expect(benkSideTabTekst(BENK_MINE_TAB)).toBe('Mine behandlinger');
        expect(benkSideTabTekst(BenkTab.TILBAKEKREVING)).toBe('Tilbakekreving');
    });
});
