import { describe, expect, test } from '@jest/globals';
import { periodiserBarnetilleggFraSøknad } from './periodiserBarnetilleggFraSøknad';
import { finn16årsdag, forrigeDag } from '~/utils/date';
import { SøknadBarn, SøknadBarnKilde } from '~/lib/søknad/søknadTyper';
import { ikkeSladdet, sladdbarTekst, sladdet } from '~/types/SladdetVerdi';

const fødselsdatoFor = (barn: SøknadBarn) => sladdbarTekst(barn.fødselsdato);

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
    fødselsdato: ikkeSladdet('2008-06-30'),
    fornavn: ikkeSladdet('Ola'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet(null),
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: ikkeSladdet(null),
};

const barnSomIkkeOppholderSegIEØS: SøknadBarn = {
    fødselsdato: ikkeSladdet('2008-06-30'),
    fornavn: ikkeSladdet('Ole'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet(null),
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'NEI',
    },
    fnr: ikkeSladdet(null),
};

const barnSomBlir16TidligIPerioden: SøknadBarn = {
    fødselsdato: ikkeSladdet('2008-07-15'),
    fornavn: ikkeSladdet('Kari'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet(null),
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: ikkeSladdet(null),
};

const barnSomBlir16MidtIPerioden: SøknadBarn = {
    fødselsdato: ikkeSladdet('2008-12-31'),
    fornavn: ikkeSladdet('Bob'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet(null),
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: ikkeSladdet(null),
};

const barnSomBlir16SentIPerioden: SøknadBarn = {
    fødselsdato: ikkeSladdet('2009-06-15'),
    fornavn: ikkeSladdet('Alice'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet(null),
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: ikkeSladdet(null),
};

const barnSomErUnder16HelePerioden: SøknadBarn = {
    fødselsdato: ikkeSladdet('2010-01-01'),
    fornavn: ikkeSladdet('Chuck'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet(null),
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: ikkeSladdet(null),
};

const barnSomBlirFødtTidligIPerioden: SøknadBarn = {
    fødselsdato: ikkeSladdet('2024-08-01'),
    fornavn: ikkeSladdet('Sneed'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet(null),
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: ikkeSladdet(null),
};

const barnSomBlirFødtMidtIPerioden: SøknadBarn = {
    fødselsdato: ikkeSladdet('2025-01-01'),
    fornavn: ikkeSladdet('Knoll'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet(null),
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: ikkeSladdet(null),
};

const barnSomBlirFødtSentIPerioden: SøknadBarn = {
    fødselsdato: ikkeSladdet('2025-06-15'),
    fornavn: ikkeSladdet('Tott'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet(null),
    kilde: SøknadBarnKilde.PDL,
    oppholderSegIEØSSpm: {
        svar: 'JA',
    },
    fnr: ikkeSladdet(null),
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
                    tilOgMed: forrigeDag(fødselsdatoFor(barnSomBlirFødtMidtIPerioden)),
                },
            },
            {
                antallBarn: 3,
                periode: {
                    fraOgMed: fødselsdatoFor(barnSomBlirFødtMidtIPerioden),
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
                    fraOgMed: fødselsdatoFor(barnSomBlirFødtMidtIPerioden),
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
                    tilOgMed: forrigeDag(finn16årsdag(fødselsdatoFor(barnSomBlir16SentIPerioden))),
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
                    tilOgMed: forrigeDag(fødselsdatoFor(barnSomBlirFødtTidligIPerioden)),
                },
            },
            {
                antallBarn: 4,
                periode: {
                    fraOgMed: fødselsdatoFor(barnSomBlirFødtTidligIPerioden),
                    tilOgMed: forrigeDag(finn16årsdag(fødselsdatoFor(barnSomBlir16SentIPerioden))),
                },
            },
            {
                antallBarn: 3,
                periode: {
                    fraOgMed: finn16årsdag(fødselsdatoFor(barnSomBlir16SentIPerioden)),
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
                    tilOgMed: forrigeDag(
                        finn16årsdag(fødselsdatoFor(barnSomBlir16TidligIPerioden)),
                    ),
                },
            },
            {
                antallBarn: 1,
                periode: {
                    fraOgMed: fødselsdatoFor(barnSomBlirFødtSentIPerioden),
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
                    tilOgMed: forrigeDag(finn16årsdag(fødselsdatoFor(barnSomBlir16MidtIPerioden))),
                },
            },
            {
                antallBarn: 1,
                periode: {
                    fraOgMed: finn16årsdag(fødselsdatoFor(barnSomBlir16MidtIPerioden)),
                    tilOgMed: forrigeDag(fødselsdatoFor(barnSomBlirFødtSentIPerioden)),
                },
            },
            {
                antallBarn: 2,
                periode: {
                    fraOgMed: fødselsdatoFor(barnSomBlirFødtSentIPerioden),
                    tilOgMed: vedtaksperiode.tilOgMed,
                },
            },
        ]);
    });

    test('barn med sladdet fødselsdato utelates', () => {
        const barnetillegg = periodiserBarnetilleggFraSøknad(
            [
                barnSomErUnder16HelePerioden,
                { ...barnSomErUnder16HelePerioden, fødselsdato: sladdet },
            ],
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
