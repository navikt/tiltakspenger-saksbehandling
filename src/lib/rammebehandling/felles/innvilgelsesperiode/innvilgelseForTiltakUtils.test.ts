import { describe, expect, test } from '@jest/globals';
import {
    antallDager,
    innvilgelsesperioder,
    omgjøringIkkeValgt,
    periode,
    søknadsbehandlingIkkeValgt,
    tiltaksdeltakelse,
} from '~test/rammebehandling';
import {
    hentAvgrensningForNyttTiltak,
    hentDelperioder,
    hentTiltakSomKanVelges,
    tilInnvilgelsesperioderSkjema,
    tilpassAntallDager,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/innvilgelseForTiltakUtils';
import { InnvilgelseForTiltak } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Periode } from '~/types/Periode';
import { Søknadsbehandling } from '~/lib/rammebehandling/typer/Søknadsbehandling';

const tiltak = (internDeltakelseId: string, ...perioder: Periode[]): InnvilgelseForTiltak => ({
    internDeltakelseId,
    erReversertOpphør: false,
    perioder: perioder.map((periode) => ({ periode })),
});

const tiltakNøkkel = (internDeltakelseId: string) => ({
    internDeltakelseId,
    erReversertOpphør: false,
});

const medDeltakelse = (
    behandling: Søknadsbehandling,
    id: string,
    deltakelsesperiode: Periode,
    antallDagerPerUke: number | null = null,
): Søknadsbehandling => ({
    ...behandling,
    saksopplysninger: {
        ...behandling.saksopplysninger,
        tiltaksdeltagelse: [
            ...behandling.saksopplysninger.tiltaksdeltagelse,
            tiltaksdeltakelse(id, deltakelsesperiode, antallDagerPerUke),
        ],
    },
    innvilgbarePerioder: [
        ...behandling.innvilgbarePerioder,
        { internDeltakelseId: id, periode: deltakelsesperiode },
    ],
});

describe('hentDelperioder', () => {
    test('deler opp der periodene for tiltakene starter eller slutter', () => {
        expect(
            hentDelperioder([
                tiltak('deltakelse_1', periode('2025-01-01', '2025-03-31')),
                tiltak('deltakelse_2', periode('2025-03-01', '2025-06-30')),
            ]),
        ).toEqual([
            {
                periode: periode('2025-01-01', '2025-02-28'),
                tiltak: [tiltakNøkkel('deltakelse_1')],
            },
            {
                periode: periode('2025-03-01', '2025-03-31'),
                tiltak: [tiltakNøkkel('deltakelse_1'), tiltakNøkkel('deltakelse_2')],
            },
            {
                periode: periode('2025-04-01', '2025-06-30'),
                tiltak: [tiltakNøkkel('deltakelse_2')],
            },
        ]);
    });

    test('tar ikke med hull, og slår ikke sammen tilstøtende perioder for samme tiltak', () => {
        expect(
            hentDelperioder([
                tiltak(
                    'deltakelse_1',
                    periode('2025-01-01', '2025-01-31'),
                    periode('2025-02-01', '2025-02-28'),
                    periode('2025-04-01', '2025-04-30'),
                ),
            ]).map((it) => it.periode),
        ).toEqual([
            periode('2025-01-01', '2025-01-31'),
            periode('2025-02-01', '2025-02-28'),
            periode('2025-04-01', '2025-04-30'),
        ]);
    });
});

describe('tilInnvilgelsesperioderSkjema', () => {
    test('deler opp en sammenslått periode fra backend i én verdi per delperiode', () => {
        const tiltakene = [
            tiltak(
                'deltakelse_1',
                periode('2025-01-01', '2025-01-31'),
                periode('2025-02-01', '2025-03-31'),
            ),
            tiltak('deltakelse_2', periode('2025-03-01', '2025-04-30')),
        ];

        expect(
            tilInnvilgelsesperioderSkjema({
                tiltak: tiltakene,
                antallDagerPerMeldeperiode: [
                    antallDager(periode('2025-01-01', '2025-02-28'), 8),
                    antallDager(periode('2025-03-01', '2025-04-30'), 12),
                ],
            }),
        ).toEqual({
            tiltak: tiltakene,
            antallDagerPerMeldeperiode: [
                antallDager(periode('2025-01-01', '2025-01-31'), 8),
                antallDager(periode('2025-02-01', '2025-02-28'), 8),
                antallDager(periode('2025-03-01', '2025-03-31'), 12),
                antallDager(periode('2025-04-01', '2025-04-30'), 12),
            ],
        });
    });
});

describe('tilpassAntallDager', () => {
    const tiltak1 = tiltak('deltakelse_1', periode('2025-01-01', '2025-03-31'));
    const tiltak2 = tiltak('deltakelse_2', periode('2025-03-01', '2025-06-30'));

    const forrige = innvilgelsesperioder([tiltak1], 7);

    test('beholder antall dager for delperioder med de samme tiltakene, og bruker summen fra tiltaksdeltakelsene ellers', () => {
        const behandling = medDeltakelse(
            søknadsbehandlingIkkeValgt(),
            'deltakelse_2',
            tiltak2.perioder.atNonNull(0).periode,
            1,
        );

        expect(tilpassAntallDager(behandling, [tiltak1, tiltak2], forrige, true)).toEqual([
            antallDager(periode('2025-01-01', '2025-02-28'), 7),
            antallDager(periode('2025-03-01', '2025-03-31'), 12),
            antallDager(periode('2025-04-01', '2025-06-30'), 2),
        ]);
    });

    const behandlingMedSum16 = medDeltakelse(
        søknadsbehandlingIkkeValgt(),
        'deltakelse_2',
        tiltak2.perioder.atNonNull(0).periode,
        3,
    );

    test('summen fra tiltaksdeltakelsene er maks 14', () => {
        expect(
            tilpassAntallDager(behandlingMedSum16, [tiltak1, tiltak2], forrige, true).at(1),
        ).toEqual(antallDager(periode('2025-03-01', '2025-03-31'), 14));
    });

    test('summen fra tiltaksdeltakelsene er maks 10 når det ikke kan meldes for helg', () => {
        expect(
            tilpassAntallDager(behandlingMedSum16, [tiltak1, tiltak2], forrige, false).at(1),
        ).toEqual(antallDager(periode('2025-03-01', '2025-03-31'), 10));
    });
});

describe('hentAvgrensningForNyttTiltak', () => {
    const behandling = medDeltakelse(
        søknadsbehandlingIkkeValgt(),
        'deltakelse_2',
        periode('2025-03-01', '2025-12-31'),
    );

    test('avgrenser bare tiltaket det er søkt om til søknadsperioden', () => {
        expect(
            hentAvgrensningForNyttTiltak(behandling, {
                internDeltakelseId: 'deltakelse_1',
                erReversertOpphør: false,
            }),
        ).toEqual(behandling.søknad.tiltaksdeltakelseperiodeDetErSøktOm);

        expect(
            hentAvgrensningForNyttTiltak(behandling, {
                internDeltakelseId: 'deltakelse_2',
                erReversertOpphør: false,
            }),
        ).toBeUndefined();
    });
});

describe('hentTiltakSomKanVelges', () => {
    test('vanlige tiltak har samme rekkefølge som i saksopplysningene, stigende etter fra og med-dato', () => {
        const behandling = medDeltakelse(
            søknadsbehandlingIkkeValgt(),
            'deltakelse_2',
            periode('2025-03-01', '2025-06-30'),
        );

        expect(hentTiltakSomKanVelges(behandling, []).map((it) => it.internDeltakelseId)).toEqual([
            'deltakelse_1',
            'deltakelse_2',
        ]);
    });

    const behandling = omgjøringIkkeValgt({
        perioderForReversertOpphør: [
            {
                internDeltakelseId: 'deltakelse_opphørt',
                periode: periode('2025-07-01', '2025-07-31'),
                typeNavn: 'Jobbklubb',
            },
        ],
    });

    test('reversert opphør kan bare velges når vedtaksperioden overlapper den opphørte perioden', () => {
        expect(hentTiltakSomKanVelges(behandling, [], periode('2025-01-01', '2025-06-30'))).toEqual(
            [expect.objectContaining({ erReversertOpphør: false })],
        );

        expect(
            hentTiltakSomKanVelges(behandling, [], periode('2025-01-01', '2025-07-15')).at(1),
        ).toEqual({
            internDeltakelseId: 'deltakelse_opphørt',
            erReversertOpphør: true,
            typeNavn: 'Jobbklubb',
            innvilgbarePerioder: [periode('2025-07-01', '2025-07-31')],
            erGyldig: true,
        });
    });

    test('et valgt tiltak som ikke lenger kan innvilges tas med som ugyldig', () => {
        expect(
            hentTiltakSomKanVelges(behandling, [
                { internDeltakelseId: 'deltakelse_borte', erReversertOpphør: false },
            ]).at(-1),
        ).toMatchObject({
            internDeltakelseId: 'deltakelse_borte',
            innvilgbarePerioder: [],
            erGyldig: false,
        });
    });
});
