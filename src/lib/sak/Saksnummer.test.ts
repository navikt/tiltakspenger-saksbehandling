import { describe, expect, test } from '@jest/globals';
import { GetServerSidePropsContext } from 'next';
import { erSaksnummer, saksnummerFraPageContext, tilSaksnummer } from '~/lib/sak/Saksnummer';

const kontekst = (params: GetServerSidePropsContext['params']) =>
    ({ params }) as GetServerSidePropsContext;

describe('saksnummer', () => {
    test('må bestå av minst 12 sifre', () => {
        expect(erSaksnummer('202501011001')).toBe(true);
        expect(erSaksnummer('2025010110011')).toBe(true);
        expect(erSaksnummer('20250101100')).toBe(false);
    });

    test('andre tegn enn sifre er ugyldige', () => {
        expect(erSaksnummer('')).toBe(false);
        expect(erSaksnummer(' 202501011001')).toBe(false);
        expect(erSaksnummer('202501011001\n')).toBe(false);
        expect(erSaksnummer('2025-0101-1001')).toBe(false);
        expect(erSaksnummer('sak_202501011001')).toBe(false);
    });

    test('tilSaksnummer kaster for ugyldige saksnummer', () => {
        expect(tilSaksnummer('202501011001')).toBe('202501011001');
        expect(() => tilSaksnummer('123')).toThrow('Ugyldig saksnummer: 123');
    });

    test('saksnummer fra url-en, eller null når det mangler eller er ugyldig', () => {
        expect(saksnummerFraPageContext(kontekst({ saksnummer: '202501011001' }))).toBe(
            '202501011001',
        );
        expect(saksnummerFraPageContext(kontekst({ saksnummer: 'abc' }))).toBeNull();
        expect(saksnummerFraPageContext(kontekst({ saksnummer: ['202501011001'] }))).toBeNull();
        expect(saksnummerFraPageContext(kontekst({}))).toBeNull();
        expect(saksnummerFraPageContext(kontekst(undefined))).toBeNull();
    });
});
