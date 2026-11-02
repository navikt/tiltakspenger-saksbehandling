import { describe, expect, test } from '@jest/globals';
import {
    erSladdet,
    formaterSladdbarVerdi,
    hentVerdi,
    SLADDET_TEKST_DEFAULT,
    sladdbarTekst,
    sladdbarTekstEllerNull,
} from '~/utils/sladdetVerdi';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';

describe('erSladdet', () => {
    test('skiller sladdede fra ikke-sladdede verdier, også når verdien mangler', () => {
        expect(erSladdet(sladdet)).toBe(true);
        expect(erSladdet(ikkeSladdet(null))).toBe(false);
        expect(erSladdet(ikkeSladdet('tekst'))).toBe(false);
    });
});

describe('hentVerdi', () => {
    test('gir verdien når den ikke er sladdet', () => {
        expect(hentVerdi(ikkeSladdet('12345678911'))).toBe('12345678911');
        expect(hentVerdi(ikkeSladdet(0))).toBe(0);
    });

    test('gir null for sladdede og manglende verdier', () => {
        expect(hentVerdi(sladdet)).toBeNull();
        expect(hentVerdi(ikkeSladdet(null))).toBeNull();
        expect(hentVerdi(undefined)).toBeNull();
    });
});

describe('formaterSladdbarVerdi', () => {
    const formaterKroner = (beløp: number) => `${beløp} kr`;

    test('formaterer verdien når den ikke er sladdet', () => {
        expect(formaterSladdbarVerdi(ikkeSladdet(100), formaterKroner)).toBe('100 kr');
    });

    test('formaterer også falsy verdier som 0 og tom streng', () => {
        expect(formaterSladdbarVerdi(ikkeSladdet(0), formaterKroner)).toBe('0 kr');
        expect(formaterSladdbarVerdi(ikkeSladdet(''), (t) => `[${t}]`)).toBe('[]');
    });

    test('manglende verdi gir tom tekst, uten å kalle formatereren', () => {
        const formater = (): string => {
            throw new Error('Skal ikke kalles');
        };

        expect(formaterSladdbarVerdi(ikkeSladdet<number | null>(null), formater)).toBe('');
        expect(formaterSladdbarVerdi(ikkeSladdet<number | null>(null), formater, 'Ukjent')).toBe(
            'Ukjent',
        );
    });

    test('sladdet verdi gir sladdet tekst, også når tom tekst er angitt', () => {
        expect(formaterSladdbarVerdi(sladdet, formaterKroner, 'Ukjent')).toBe(
            SLADDET_TEKST_DEFAULT,
        );
        expect(formaterSladdbarVerdi(sladdet, formaterKroner, 'Ukjent', '***')).toBe('***');
    });
});

describe('sladdbarTekst', () => {
    test('gir teksten, eller tom streng når den mangler', () => {
        expect(sladdbarTekst(ikkeSladdet('Begrunnelse'))).toBe('Begrunnelse');
        expect(sladdbarTekst(ikkeSladdet(null))).toBe('');
        expect(sladdbarTekst(undefined)).toBe('');
    });

    test('sladdet tekst vises med standardteksten eller egen tekst', () => {
        expect(sladdbarTekst(sladdet)).toBe(SLADDET_TEKST_DEFAULT);
        expect(sladdbarTekst(sladdet, 'Skjult')).toBe('Skjult');
    });
});

describe('sladdbarTekstEllerNull', () => {
    test('skiller manglende tekst (null) fra utfylt tekst', () => {
        expect(sladdbarTekstEllerNull(ikkeSladdet(null))).toBeNull();
        expect(sladdbarTekstEllerNull(undefined)).toBeNull();
        expect(sladdbarTekstEllerNull(ikkeSladdet(''))).toBe('');
        expect(sladdbarTekstEllerNull(ikkeSladdet('Tekst'))).toBe('Tekst');
    });

    test('sladdet tekst regnes som utfylt og vises som sladdet', () => {
        expect(sladdbarTekstEllerNull(sladdet)).toBe(SLADDET_TEKST_DEFAULT);
        expect(sladdbarTekstEllerNull(sladdet, 'Skjult')).toBe('Skjult');
    });
});
