import { describe, expect, test } from '@jest/globals';
import { periodiserBarnetilleggFraSøknad } from './periodiserBarnetilleggFraSøknad';
import { finn16årsdag, forrigeDag } from '~/utils/date';
import { SøknadBarn, SøknadBarnKilde } from '~/types/Søknad';

const vedtaksperiode = {
    fraOgMed: '2024-07-01',
    tilOgMed: '2025-06-30',
};

const innvilgelsesperioder = [
    {
        periode: vedtaksperiode,
    },
];

const barnSomBlir16FørPerioden: SøknadBarn = {
    fødselsdato: '2008-06-30',
    fornavn: 'Ola',
    mellomnavn: null,
    etternavn: null,
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: null,
};

const barnSomIkkeOppholderSegIEØS: SøknadBarn = {
    fødselsdato: '2008-06-30',
    fornavn: 'Ole',
    mellomnavn: null,
    etternavn: null,
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'NEI',
    },
    fnr: null,
};

const barnSomBlir16TidligIPerioden: SøknadBarn = {
    fødselsdato: '2008-07-15',
    fornavn: 'Kari',
    mellomnavn: null,
    etternavn: null,
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: null,
};

const barnSomBlir16MidtIPerioden: SøknadBarn = {
    fødselsdato: '2008-12-31',
    fornavn: 'Bob',
    mellomnavn: null,
    etternavn: null,
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: null,
};

const barnSomBlir16SentIPerioden: SøknadBarn = {
    fødselsdato: '2009-06-15',
    fornavn: 'Alice',
    mellomnavn: null,
    etternavn: null,
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: null,
};

const barnSomErUnder16HelePerioden: SøknadBarn = {
    fødselsdato: '2010-01-01',
    fornavn: 'Chuck',
    mellomnavn: null,
    etternavn: null,
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: null,
};

const barnSomBlirFødtTidligIPerioden: SøknadBarn = {
    fødselsdato: '2024-08-01',
    fornavn: 'Sneed',
    mellomnavn: null,
    etternavn: null,
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: null,
};

const barnSomBlirFødtMidtIPerioden: SøknadBarn = {
    fødselsdato: '2025-01-01',
    fornavn: 'Knoll',
    mellomnavn: null,
    etternavn: null,
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: null,
};

const barnSomBlirFødtSentIPerioden: SøknadBarn = {
    fødselsdato: '2025-06-15',
    fornavn: 'Tott',
    mellomnavn: null,
    etternavn: null,
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: null,
};

describe('Periodiserer barnetillegg fra søknaden', () => {
    test('3 barn i hele perioden', () => {
        const barnetillegg = periodiserBarnetilleggFraSøknad(
            [
                barnSomErUnder16HelePerioden,
                barnSomErUnder16HelePerioden,
                barnSomErUnder16HelePerioden,
            ],
            innvilgelsesperioder,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 3,
                periode: {
                    fraOgMed: vedtaksperiode.fraOgMed,
                    tilOgMed: vedtaksperiode.tilOgMed,
                },
            },
        ]);
    });

    test('2 barn hele perioden + 1 fødsel i løpet av perioden', () => {
        const barnetillegg = periodiserBarnetilleggFraSøknad(
            [
                barnSomErUnder16HelePerioden,
                barnSomErUnder16HelePerioden,
                barnSomBlirFødtMidtIPerioden,
            ],
            innvilgelsesperioder,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 2,
                periode: {
                    fraOgMed: vedtaksperiode.fraOgMed,
                    tilOgMed: forrigeDag(barnSomBlirFødtMidtIPerioden.fødselsdato),
                },
            },
            {
                antallBarn: 3,
                periode: {
                    fraOgMed: barnSomBlirFødtMidtIPerioden.fødselsdato,
                    tilOgMed: vedtaksperiode.tilOgMed,
                },
            },
        ]);
    });

    test('1 fødsel i løpet av perioden', () => {
        const barnetillegg = periodiserBarnetilleggFraSøknad(
            [barnSomBlirFødtMidtIPerioden],
            innvilgelsesperioder,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 1,
                periode: {
                    fraOgMed: barnSomBlirFødtMidtIPerioden.fødselsdato,
                    tilOgMed: vedtaksperiode.tilOgMed,
                },
            },
        ]);
    });

    test('1 barn som blir 16 i løpet av perioden', () => {
        const barnetillegg = periodiserBarnetilleggFraSøknad(
            [barnSomBlir16SentIPerioden],
            innvilgelsesperioder,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 1,
                periode: {
                    fraOgMed: vedtaksperiode.fraOgMed,
                    tilOgMed: forrigeDag(finn16årsdag(barnSomBlir16SentIPerioden.fødselsdato)),
                },
            },
        ]);
    });

    test('2 barn hele perioden + 1 fødsel i løpet av perioden + 1 blir 16', () => {
        const barnetillegg = periodiserBarnetilleggFraSøknad(
            [
                barnSomErUnder16HelePerioden,
                barnSomErUnder16HelePerioden,
                barnSomBlirFødtTidligIPerioden,
                barnSomBlir16SentIPerioden,
            ],
            innvilgelsesperioder,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 3,
                periode: {
                    fraOgMed: vedtaksperiode.fraOgMed,
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
                    tilOgMed: vedtaksperiode.tilOgMed,
                },
            },
        ]);
    });

    test('1 barn blir 16 år, og 1 blir senere født', () => {
        const barnetillegg = periodiserBarnetilleggFraSøknad(
            [barnSomBlir16TidligIPerioden, barnSomBlirFødtSentIPerioden],
            innvilgelsesperioder,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 1,
                periode: {
                    fraOgMed: vedtaksperiode.fraOgMed,
                    tilOgMed: forrigeDag(finn16årsdag(barnSomBlir16TidligIPerioden.fødselsdato)),
                },
            },
            {
                antallBarn: 1,
                periode: {
                    fraOgMed: barnSomBlirFødtSentIPerioden.fødselsdato,
                    tilOgMed: vedtaksperiode.tilOgMed,
                },
            },
        ]);
    });

    test('2 barn blir 16 før perioden, 1 barn i hele perioden, 1 barn blir 16 i perioden, og 1 blir senere født', () => {
        const barnetillegg = periodiserBarnetilleggFraSøknad(
            [
                barnSomBlir16FørPerioden,
                barnSomBlir16FørPerioden,
                barnSomErUnder16HelePerioden,
                barnSomBlir16MidtIPerioden,
                barnSomBlirFødtSentIPerioden,
            ],
            innvilgelsesperioder,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 2,
                periode: {
                    fraOgMed: vedtaksperiode.fraOgMed,
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
                    tilOgMed: vedtaksperiode.tilOgMed,
                },
            },
        ]);
    });

    test('1 barn i EØS hele periode, 1 barn utenfor EØS', () => {
        const barnetillegg = periodiserBarnetilleggFraSøknad(
            [barnSomErUnder16HelePerioden, barnSomIkkeOppholderSegIEØS],
            innvilgelsesperioder,
        );

        expect(barnetillegg).toEqual([
            {
                antallBarn: 1,
                periode: {
                    fraOgMed: vedtaksperiode.fraOgMed,
                    tilOgMed: vedtaksperiode.tilOgMed,
                },
            },
        ]);
    });
});
