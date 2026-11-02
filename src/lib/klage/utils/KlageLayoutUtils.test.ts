import { describe, expect, test } from '@jest/globals';
import { finnNesteKlageSteg, kanNavigereTilKlageSteg, KlageSteg } from './KlageLayoutUtils';
import { KlagebehandlingStatus, KlagefristUnntakSvarord } from '~/lib/klage/typer/Klage';
import {
    avvistResultat,
    formkrav,
    klagebehandling,
    omgjørResultat,
    opprettholdtResultat,
    ventestatus,
} from '~test/klage';

const url = (steg: string) => `/sak/202501011001/klage/klage_1/${steg}`;

describe('finnNesteKlageSteg', () => {
    test.each([
        ['uten resultat', null],
        ['avvist', avvistResultat()],
        ['omgjøring', omgjørResultat()],
    ])('fra formkrav går man alltid til forvaltningsmelding (%s)', (_, resultat) => {
        expect(finnNesteKlageSteg(klagebehandling({ resultat }), KlageSteg.FORMKRAV)).toBe(
            url('forvaltningsmelding'),
        );
    });

    test('fra forvaltningsmelding går avvist klage rett til brev', () => {
        const klage = klagebehandling({ resultat: avvistResultat() });
        expect(finnNesteKlageSteg(klage, KlageSteg.FORVALTNINGSMELDING)).toBe(url('brev'));
    });

    test.each([
        ['uten resultat', null],
        ['omgjøring', omgjørResultat()],
        ['opprettholdelse', opprettholdtResultat()],
    ])('fra forvaltningsmelding går klage %s til vurdering', (_, resultat) => {
        expect(
            finnNesteKlageSteg(klagebehandling({ resultat }), KlageSteg.FORVALTNINGSMELDING),
        ).toBe(url('vurdering'));
    });

    test('fra vurdering går omgjøring til resultat', () => {
        const klage = klagebehandling({ resultat: omgjørResultat() });
        expect(finnNesteKlageSteg(klage, KlageSteg.VURDERING)).toBe(url('resultat'));
    });

    test('fra vurdering går opprettholdelse til brev', () => {
        const klage = klagebehandling({ resultat: opprettholdtResultat() });
        expect(finnNesteKlageSteg(klage, KlageSteg.VURDERING)).toBe(url('brev'));
    });

    test('fra vurdering blir man stående når klagen ikke er vurdert', () => {
        expect(finnNesteKlageSteg(klagebehandling(), KlageSteg.VURDERING)).toBe(url('vurdering'));
    });

    test.each([KlageSteg.BREV, KlageSteg.RESULTAT])('fra %s går man til resultat', (steg) => {
        const klage = klagebehandling({ resultat: opprettholdtResultat() });
        expect(finnNesteKlageSteg(klage, steg)).toBe(url('resultat'));
    });
});

describe('kanNavigereTilKlageSteg', () => {
    test.each([KlageSteg.FORMKRAV, KlageSteg.FORVALTNINGSMELDING])(
        '%s er alltid tilgjengelig, også for avbrutte klager',
        (steg) => {
            const klage = klagebehandling({
                status: KlagebehandlingStatus.AVBRUTT,
                formkrav: formkrav({ vedtakDetKlagesPå: null }),
            });
            expect(kanNavigereTilKlageSteg(klage, steg)).toBe(true);
        },
    );

    describe('vurdering', () => {
        test('er tilgjengelig når alle formkrav er oppfylt', () => {
            expect(kanNavigereTilKlageSteg(klagebehandling(), KlageSteg.VURDERING)).toBe(true);
        });

        test('er tilgjengelig når fristen er oversittet, men det er gjort unntak', () => {
            const klage = klagebehandling({
                formkrav: formkrav({
                    erKlagefristenOverholdt: false,
                    erUnntakForKlagefrist: KlagefristUnntakSvarord.JA_AV_SÆRLIGE_GRUNNER,
                }),
            });
            expect(kanNavigereTilKlageSteg(klage, KlageSteg.VURDERING)).toBe(true);
        });

        test('er ikke tilgjengelig når et formkrav ikke er oppfylt (avvisning)', () => {
            const klage = klagebehandling({
                formkrav: formkrav({ erKlagenSignert: false }),
                resultat: avvistResultat(),
            });
            expect(kanNavigereTilKlageSteg(klage, KlageSteg.VURDERING)).toBe(false);
        });
    });

    describe('brev', () => {
        test.each([
            ['avvist', true, avvistResultat()],
            ['opprettholdt', true, opprettholdtResultat()],
            ['omgjort', false, omgjørResultat()],
            ['ikke vurdert', false, null],
        ])('klage som er %s: %s', (_, forventet, resultat) => {
            expect(kanNavigereTilKlageSteg(klagebehandling({ resultat }), KlageSteg.BREV)).toBe(
                forventet,
            );
        });
    });

    describe('resultat', () => {
        test('er tilgjengelig for omgjøring', () => {
            const klage = klagebehandling({ resultat: omgjørResultat() });
            expect(kanNavigereTilKlageSteg(klage, KlageSteg.RESULTAT)).toBe(true);
        });

        test('er ikke tilgjengelig for opprettholdelse som fortsatt er under behandling', () => {
            const klage = klagebehandling({ resultat: opprettholdtResultat() });
            expect(kanNavigereTilKlageSteg(klage, KlageSteg.RESULTAT)).toBe(false);
        });

        test('er tilgjengelig for opprettholdelse som er oversendt klageinstansen', () => {
            const klage = klagebehandling({
                status: KlagebehandlingStatus.OVERSENDT,
                resultat: opprettholdtResultat(),
            });
            expect(kanNavigereTilKlageSteg(klage, KlageSteg.RESULTAT)).toBe(true);
        });

        test('er tilgjengelig for opprettholdt klage som er satt på vent etter opprettholdelse', () => {
            const klage = klagebehandling({
                status: KlagebehandlingStatus.KLAR_TIL_BEHANDLING,
                resultat: opprettholdtResultat(),
                ventestatus: [ventestatus({ status: KlagebehandlingStatus.OPPRETTHOLDT })],
            });
            expect(kanNavigereTilKlageSteg(klage, KlageSteg.RESULTAT)).toBe(true);
        });

        test('er ikke tilgjengelig for avvist klage, selv når den er vedtatt', () => {
            const klage = klagebehandling({
                status: KlagebehandlingStatus.VEDTATT,
                resultat: avvistResultat(),
            });
            expect(kanNavigereTilKlageSteg(klage, KlageSteg.RESULTAT)).toBe(false);
        });
    });
});
