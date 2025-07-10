import { describe, expect, test } from '@jest/globals';
import { SøknadBarnKilde } from '../types/SøknadTypes';
import { Periode } from '../types/Periode';
import { periodiserBarnetillegg } from './BarnetilleggUtils';
import { finn16årsdag, forrigeDag } from './date';

const virkningsperiode: Periode = {
    fraOgMed: '2024-07-01',
    tilOgMed: '2025-06-30',
};

const barnSomBlir16FørPerioden = {
    fødselsdato: '2008-06-30',
    fornavn: 'Ola',
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØS: true,
};

const barnSomBlir16TidligIPerioden = {
    fødselsdato: '2008-07-15',
    fornavn: 'Kari',
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØS: true,
};

const barnSomBlir16MidtIPerioden = {
    fødselsdato: '2008-12-31',
    fornavn: 'Bob',
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØS: true,
};

const barnSomBlir16SentIPerioden = {
    fødselsdato: '2009-06-15',
    fornavn: 'Alice',
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØS: true,
};

const barnSomErUnder16HelePerioden = {
    fødselsdato: '2010-01-01',
    fornavn: 'Chuck',
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØS: true,
};

const barnSomBlirFødtTidligIPerioden = {
    fødselsdato: '2024-08-01',
    fornavn: 'Sneed',
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØS: true,
};

const barnSomBlirFødtMidtIPerioden = {
    fødselsdato: '2025-01-01',
    fornavn: 'Knoll',
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØS: true,
};

const barnSomBlirFødtSentIPerioden = {
    fødselsdato: '2025-06-15',
    fornavn: 'Tott',
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØS: true,
};

describe('Periodiserer barnetillegg fra søknaden', () => {
    test('3 barn i hele perioden', () => {
        const barnetillegg = periodiserBarnetillegg(
            [
                barnSomErUnder16HelePerioden,
                barnSomErUnder16HelePerioden,
                barnSomErUnder16HelePerioden,
            ],
            virkningsperiode,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 3,
                periode: {
                    fraOgMed: virkningsperiode.fraOgMed,
                    tilOgMed: virkningsperiode.tilOgMed,
                },
            },
        ]);
    });

    test('2 barn hele perioden + 1 fødsel i løpet av perioden', () => {
        const barnetillegg = periodiserBarnetillegg(
            [
                barnSomErUnder16HelePerioden,
                barnSomErUnder16HelePerioden,
                barnSomBlirFødtMidtIPerioden,
            ],
            virkningsperiode,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 2,
                periode: {
                    fraOgMed: virkningsperiode.fraOgMed,
                    tilOgMed: forrigeDag(barnSomBlirFødtMidtIPerioden.fødselsdato),
                },
            },
            {
                antallBarn: 3,
                periode: {
                    fraOgMed: barnSomBlirFødtMidtIPerioden.fødselsdato,
                    tilOgMed: virkningsperiode.tilOgMed,
                },
            },
        ]);
    });

    test('1 fødsel i løpet av perioden', () => {
        const barnetillegg = periodiserBarnetillegg(
            [barnSomBlirFødtMidtIPerioden],
            virkningsperiode,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 1,
                periode: {
                    fraOgMed: barnSomBlirFødtMidtIPerioden.fødselsdato,
                    tilOgMed: virkningsperiode.tilOgMed,
                },
            },
        ]);
    });

    test('1 barn som blir 16 i løpet av perioden', () => {
        const barnetillegg = periodiserBarnetillegg([barnSomBlir16SentIPerioden], virkningsperiode);

        expect(barnetillegg).toEqual([
            {
                antallBarn: 1,
                periode: {
                    fraOgMed: virkningsperiode.fraOgMed,
                    tilOgMed: forrigeDag(finn16årsdag(barnSomBlir16SentIPerioden.fødselsdato)),
                },
            },
        ]);
    });

    test('2 barn hele perioden + 1 fødsel i løpet av perioden + 1 blir 16', () => {
        const barnetillegg = periodiserBarnetillegg(
            [
                barnSomErUnder16HelePerioden,
                barnSomErUnder16HelePerioden,
                barnSomBlirFødtTidligIPerioden,
                barnSomBlir16SentIPerioden,
            ],
            virkningsperiode,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 3,
                periode: {
                    fraOgMed: virkningsperiode.fraOgMed,
                    tilOgMed: forrigeDag(barnSomBlirFødtTidligIPerioden.fødselsdato),
                },
            },
            {
                antallBarn: 4,
                periode: {
                    fraOgMed: barnSomBlirFødtTidligIPerioden.fødselsdato,
                    tilOgMed: forrigeDag(finn16årsdag(barnSomBlir16SentIPerioden.fødselsdato)),
                },
            },
            {
                antallBarn: 3,
                periode: {
                    fraOgMed: finn16årsdag(barnSomBlir16SentIPerioden.fødselsdato),
                    tilOgMed: virkningsperiode.tilOgMed,
                },
            },
        ]);
    });

    test('1 barn blir 16 år, og 1 blir senere født', () => {
        const barnetillegg = periodiserBarnetillegg(
            [barnSomBlir16TidligIPerioden, barnSomBlirFødtSentIPerioden],
            virkningsperiode,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 1,
                periode: {
                    fraOgMed: virkningsperiode.fraOgMed,
                    tilOgMed: forrigeDag(finn16årsdag(barnSomBlir16TidligIPerioden.fødselsdato)),
                },
            },
            {
                antallBarn: 1,
                periode: {
                    fraOgMed: barnSomBlirFødtSentIPerioden.fødselsdato,
                    tilOgMed: virkningsperiode.tilOgMed,
                },
            },
        ]);
    });

    test('2 barn blir 16 før perioden, 1 barn i hele perioden, 1 barn blir 16 i perioden, og 1 blir senere født', () => {
        const barnetillegg = periodiserBarnetillegg(
            [
                barnSomBlir16FørPerioden,
                barnSomBlir16FørPerioden,
                barnSomErUnder16HelePerioden,
                barnSomBlir16MidtIPerioden,
                barnSomBlirFødtSentIPerioden,
            ],
            virkningsperiode,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 2,
                periode: {
                    fraOgMed: virkningsperiode.fraOgMed,
                    tilOgMed: forrigeDag(finn16årsdag(barnSomBlir16MidtIPerioden.fødselsdato)),
                },
            },
            {
                antallBarn: 1,
                periode: {
                    fraOgMed: finn16årsdag(barnSomBlir16MidtIPerioden.fødselsdato),
                    tilOgMed: forrigeDag(barnSomBlirFødtSentIPerioden.fødselsdato),
                },
            },
            {
                antallBarn: 2,
                periode: {
                    fraOgMed: barnSomBlirFødtSentIPerioden.fødselsdato,
                    tilOgMed: virkningsperiode.tilOgMed,
                },
            },
        ]);
    });
});
