import { describe, expect, test } from '@jest/globals';
import { tilDato } from '~/types/DatoTid';
import { validerBarnetillegg } from '~/lib/rammebehandling/felles/validering/validerBarnetillegg';
import { innvilgelsesperiode, periode, søknad, søknadBarn } from '~test/rammebehandling';
import { skjemaBarn } from '~test/barnetilleggSkjema';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import { hentBarnFraSøknad } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import { BarnetilleggBarnKilde } from '~/lib/rammebehandling/typer/Barnetillegg';

const førsteKvartal = periode('2025-01-01', '2025-03-31');
const innvilgelsesperioder = [innvilgelsesperiode(førsteKvartal)];

// Barnet er under 16 år i hele førsteKvartal
const barnFraSøknad = hentBarnFraSøknad(søknad([søknadBarn('2020-05-05')]));
const valgtBarnFraSøknad = barnFraSøknad.atNonNull(0).barn;

const manueltBarn = skjemaBarn('2021-01-01', {
    fornavn: ikkeSladdet('Manuell'),
    kilde: BarnetilleggBarnKilde.SAKSBEHANDLER,
    søknadId: null,
});

const valider = (
    valgteBarn: Parameters<typeof validerBarnetillegg>[1],
    fraSøknad: Parameters<typeof validerBarnetillegg>[3] = barnFraSøknad,
) => validerBarnetillegg(true, valgteBarn, innvilgelsesperioder, fraSøknad);

describe('validerBarnetillegg', () => {
    describe('når barnetillegg ikke er innvilget', () => {
        test('gir ingen varsler når søknaden er uten barn', () => {
            expect(validerBarnetillegg(false, [], innvilgelsesperioder, [])).toEqual({
                errors: [],
                warnings: [],
            });
        });

        test('advarer når barn fra søknaden har rett, og validerer ikke valgte barn', () => {
            expect(
                validerBarnetillegg(
                    false,
                    [{ ...manueltBarn, fødselsdato: ikkeSladdet(tilDato('2030-01-01')) }],
                    innvilgelsesperioder,
                    barnFraSøknad,
                ),
            ).toEqual({
                errors: [],
                warnings: [
                    'Det er søkt om barnetillegg, men barnetillegg er ikke innvilget - Barn fra søknaden med rett i innvilgelsesperioden: Barn Barnesen (født 05.05.2020)',
                ],
            });
        });

        test('advarer ikke for barn som har fylt 16 år før innvilgelsesperioden', () => {
            expect(
                validerBarnetillegg(
                    false,
                    [],
                    innvilgelsesperioder,
                    hentBarnFraSøknad(søknad([søknadBarn('2008-01-01')])),
                ),
            ).toEqual({ errors: [], warnings: [] });
        });
    });

    describe('når barnetillegg er innvilget', () => {
        test('godtar barna fra søknaden', () => {
            expect(valider([valgtBarnFraSøknad])).toEqual({ errors: [], warnings: [] });
        });

        test('krever minst ett valgt barn', () => {
            expect(valider([]).errors).toEqual([
                'Velg minst ett barn eller svar nei på om det skal innvilges barnetillegg',
            ]);
        });

        test('advarer når barn fra søknaden med rett ikke er valgt', () => {
            expect(valider([manueltBarn])).toEqual({
                errors: [],
                warnings: [
                    'Barn fra søknaden med rett i innvilgelsesperioden er ikke valgt: Barn Barnesen (født 05.05.2020)',
                ],
            });
        });

        test('advarer når et valgt barn oppholder seg utenfor EØS ifølge søknaden', () => {
            const barnUtenforEØS = hentBarnFraSøknad(
                søknad([
                    {
                        ...søknadBarn('2020-05-05'),
                        oppholdssted: 'IKKE_EØS_LAND',
                        oppholderSegIEØSSpm: { svar: 'NEI' },
                    },
                ]),
            );

            expect(valider([barnUtenforEØS.atNonNull(0).barn], barnUtenforEØS)).toEqual({
                errors: [],
                warnings: [
                    'Valgte barn oppholder seg ikke i Norge eller et annet EØS-land ifølge søknaden: Barn Barnesen (født 05.05.2020)',
                ],
            });
        });

        test('avviser barn med hele innvilgelsesperioden som ikke har rett i perioden', () => {
            const forGammeltBarn = skjemaBarn('2008-01-01');

            expect(valider([valgtBarnFraSøknad, forGammeltBarn]).errors).toEqual([
                'Barn Barnesen (født 01.01.2008): Barnet har ikke rett til barnetillegg i innvilgelsesperioden (rett fra fødsel til fylte 16 år: 01.01.2008 - 31.12.2023)',
            ]);
        });

        test('godtar en overstyrt periode som slutter dagen før barnet fyller 16 år', () => {
            const barn = skjemaBarn('2009-03-01', { periode: periode('2025-01-01', '2025-02-28') });

            expect(valider([valgtBarnFraSøknad, barn]).errors).toEqual([]);
        });

        test('avviser en overstyrt periode utenfor perioden barnet har rett', () => {
            const barn = skjemaBarn('2009-03-01', { periode: periode('2025-01-01', '2025-03-01') });

            expect(valider([valgtBarnFraSøknad, barn]).errors).toEqual([
                'Barn Barnesen (født 01.03.2009): Perioden 01.01.2025 - 01.03.2025 må være innenfor perioden barnet har rett til barnetillegg (01.03.2009 - 28.02.2025)',
            ]);
        });

        test('avviser en overstyrt periode utenfor innvilgelsesperioden', () => {
            const barn = { ...valgtBarnFraSøknad, periode: periode('2025-02-01', '2025-04-30') };

            expect(valider([barn]).errors).toEqual([
                'Barn Barnesen (født 05.05.2020): Perioden 01.02.2025 - 30.04.2025 må være innenfor innvilgelsesperioden 01.01.2025 - 31.03.2025',
            ]);
        });

        test('avviser en overstyrt periode der til og med er før fra og med', () => {
            const barn = { ...valgtBarnFraSøknad, periode: periode('2025-02-01', '2025-01-31') };

            expect(valider([barn]).errors).toEqual([
                'Barn Barnesen (født 05.05.2020): Til og med-dato må være etter fra og med-dato',
            ]);
        });

        test('avviser en overstyrt periode som bare dekker hullet mellom innvilgelsesperiodene', () => {
            const perioderMedHull = [
                innvilgelsesperiode(periode('2025-01-01', '2025-01-31')),
                innvilgelsesperiode(periode('2025-03-01', '2025-03-31')),
            ];
            const barn = { ...valgtBarnFraSøknad, periode: periode('2025-02-01', '2025-02-28') };

            expect(validerBarnetillegg(true, [barn], perioderMedHull, [])).toEqual({
                errors: [
                    'Barn Barnesen (født 05.05.2020): Perioden 01.02.2025 - 28.02.2025 overlapper ingen innvilgelsesperioder, og gir ikke barnetillegg',
                ],
                warnings: [],
            });
        });

        test('avviser ugyldig og duplisert fødselsnummer', () => {
            const medFnr = skjemaBarn('2020-01-01', { fnr: ikkeSladdet('01012012345') });
            const sammeFnr = { ...skjemaBarn('2021-01-01'), fnr: ikkeSladdet('01012012345') };
            const ugyldigFnr = skjemaBarn('2022-01-01', { fnr: ikkeSladdet('123') });

            expect(valider([valgtBarnFraSøknad, medFnr, sammeFnr, ugyldigFnr]).errors).toEqual([
                'Barn Barnesen (født 01.01.2022): Fødselsnummer må være 11 siffer',
                'Samme barn kan ikke være valgt flere ganger',
            ]);
        });

        test('avviser samme barn valgt både med og uten fnr', () => {
            const sammeBarnMedFnr = {
                ...manueltBarn,
                fornavn: valgtBarnFraSøknad.fornavn,
                fødselsdato: valgtBarnFraSøknad.fødselsdato,
                fnr: ikkeSladdet('05052012345'),
                key: 'fnr:05052012345',
            };

            expect(valider([valgtBarnFraSøknad, sammeBarnMedFnr])).toEqual({
                errors: ['Samme barn kan ikke være valgt flere ganger'],
                warnings: [],
            });
        });

        test('krever fornavn og etternavn for barn lagt til av saksbehandler, og søknad for barn fra søknad', () => {
            const utenEtternavn = { ...manueltBarn, etternavn: ikkeSladdet(null) };
            const utenSøknad = { ...skjemaBarn('2022-01-01'), søknadId: null };

            expect(valider([valgtBarnFraSøknad, utenEtternavn, utenSøknad]).errors).toEqual([
                'Manuell (født 01.01.2021): Fornavn og etternavn må fylles ut',
                'Barn Barnesen (født 01.01.2022): Barnet mangler søknaden det er hentet fra',
            ]);
        });

        test('avviser barn med sladdet fødselsdato', () => {
            const sladdetBarn = { ...valgtBarnFraSøknad, key: 'sladdet', fødselsdato: sladdet };

            expect(valider([valgtBarnFraSøknad, sladdetBarn]).errors).toEqual([
                'Barn Barnesen: Barnet har sladdede opplysninger, og kan ikke velges',
            ]);
        });
    });
});
