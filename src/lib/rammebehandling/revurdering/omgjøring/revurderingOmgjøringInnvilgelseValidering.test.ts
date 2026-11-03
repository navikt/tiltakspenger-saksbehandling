import { describe, expect, test } from '@jest/globals';
import { revurderingOmgjøringValidering } from '~/lib/rammebehandling/revurdering/omgjøring/revurderingOmgjøringValidering';
import {
    OmgjøringContext,
    OmgjøringInnvilgelseState,
} from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Periode } from '~/types/Periode';
import {
    innvilgelsesperiode,
    omgjøringIkkeValgt,
    omgjøringInnvilgelse,
    periode,
    sakMedInnvilgetVedtak,
    søknad,
    søknadBarn,
    søknadsbehandlingInnvilgelse,
} from '~test/rammebehandling';
import { tilDato, tilTidspunkt } from '~/types/DatoTid';

// Standard tiltaksdeltakelse i testbehandlingene er 01.01.2025 - 30.06.2025
const førsteHalvår = periode('2025-01-01', '2025-06-30');
const førsteKvartal = periode('2025-01-01', '2025-03-31');
const februarTilJuni = periode('2025-02-01', '2025-06-30');

const tomtTekstfelt = { ref: { current: null }, getValue: () => null };

const skjemaBase = {
    skalSendeVedtaksbrev: true,
    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
    erPrioritert: false,
    erReadonly: false,
    kanEndreSkalJournalføreNotat: true,
    textAreas: {
        begrunnelse: tomtTekstfelt,
        brevtekst: tomtTekstfelt,
        barnetilleggBegrunnelse: tomtTekstfelt,
        prioriteringBegrunnelse: tomtTekstfelt,
    },
};

const innvilgelseSkjema = (
    vedtaksperiode: Partial<Periode>,
    innvilgelsesperioder: Innvilgelsesperiode[],
    innvilgelse: Partial<OmgjøringInnvilgelseState['innvilgelse']> = {},
): OmgjøringContext => ({
    ...skjemaBase,
    resultat: RevurderingResultat.OMGJØRING,
    vedtaksperiode,
    innvilgelse: {
        harValgtPeriode: true,
        innvilgelsesperioder,
        harBarnetillegg: false,
        barnetilleggPerioder: [],
        ...innvilgelse,
    } as OmgjøringInnvilgelseState['innvilgelse'],
});

describe('revurderingOmgjøringValidering - innvilgelse', () => {
    test('godtar ikke-valgt resultat uten videre validering', () => {
        const resultat = revurderingOmgjøringValidering(
            omgjøringIkkeValgt(),
            { ...skjemaBase, resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT },
            sakMedInnvilgetVedtak(førsteHalvår),
        );

        expect(resultat).toEqual({ errors: [], warnings: [] });
    });

    test.each([{}, { fraOgMed: tilDato('2025-01-01') }, { tilOgMed: tilDato('2025-06-30') }])(
        'krever en fullstendig vedtaksperiode (%o)',
        (vedtaksperiode) => {
            const resultat = revurderingOmgjøringValidering(
                omgjøringInnvilgelse(),
                innvilgelseSkjema(vedtaksperiode, [innvilgelsesperiode(førsteHalvår)]),
                sakMedInnvilgetVedtak(førsteHalvår),
            );

            expect(resultat).toEqual({ errors: ['Du må velge en vedtaksperiode.'], warnings: [] });
        },
    );

    test('godtar innvilgelse av hele den gjeldende vedtaksperioden', () => {
        const resultat = revurderingOmgjøringValidering(
            omgjøringInnvilgelse(),
            innvilgelseSkjema(førsteHalvår, [innvilgelsesperiode(førsteHalvår)]),
            sakMedInnvilgetVedtak(førsteHalvår),
        );

        expect(resultat).toEqual({ errors: [], warnings: [] });
    });

    test('avviser en vedtaksperiode som ikke overlapper noe tidligere vedtak', () => {
        const resultat = revurderingOmgjøringValidering(
            omgjøringInnvilgelse(),
            innvilgelseSkjema(periode('2025-04-01', '2025-06-30'), [
                innvilgelsesperiode(periode('2025-04-01', '2025-06-30')),
            ]),
            sakMedInnvilgetVedtak(førsteKvartal),
        );

        expect(resultat).toEqual({
            errors: ['Valgt vedtaksperiode omgjør ingen tidligere vedtak'],
            warnings: [],
        });
    });

    describe('når vedtaksperioden utvides før gjeldende vedtak', () => {
        const sakMedVedtakFraFebruar = sakMedInnvilgetVedtak(februarTilJuni);

        test('må innvilgelsen starte samme dato som vedtaksperioden', () => {
            const resultat = revurderingOmgjøringValidering(
                omgjøringInnvilgelse(),
                innvilgelseSkjema(førsteHalvår, [innvilgelsesperiode(februarTilJuni)]),
                sakMedVedtakFraFebruar,
            );

            expect(resultat.errors).toEqual([
                'Dersom ny vedtaksperiode starter før gjeldende vedtaksperiode, må det innvilges fra samme dato.',
            ]);
        });

        test('godtas innvilgelse fra vedtaksperiodens startdato', () => {
            const resultat = revurderingOmgjøringValidering(
                omgjøringInnvilgelse(),
                innvilgelseSkjema(førsteHalvår, [innvilgelsesperiode(førsteHalvår)]),
                sakMedVedtakFraFebruar,
            );

            expect(resultat).toEqual({ errors: [], warnings: [] });
        });
    });

    describe('når vedtaksperioden utvides etter gjeldende vedtak', () => {
        const sakMedVedtakTilMars = sakMedInnvilgetVedtak(førsteKvartal);

        test('må innvilgelsen slutte samme dato som vedtaksperioden', () => {
            const resultat = revurderingOmgjøringValidering(
                omgjøringInnvilgelse(),
                innvilgelseSkjema(førsteHalvår, [
                    innvilgelsesperiode(periode('2025-01-01', '2025-04-30')),
                ]),
                sakMedVedtakTilMars,
            );

            expect(resultat.errors).toEqual([
                'Dersom ny vedtaksperiode slutter etter gjeldende vedtaksperiode, må det innvilges til samme dato.',
            ]);
        });

        test('godtas innvilgelse til vedtaksperiodens sluttdato', () => {
            const resultat = revurderingOmgjøringValidering(
                omgjøringInnvilgelse(),
                innvilgelseSkjema(førsteHalvår, [innvilgelsesperiode(førsteHalvår)]),
                sakMedVedtakTilMars,
            );

            expect(resultat).toEqual({ errors: [], warnings: [] });
        });
    });

    test('godtar at innvilgelsen er kortere enn vedtaksperioden innenfor gjeldende vedtak, med advarsel om delvis opphør ved hull', () => {
        const resultat = revurderingOmgjøringValidering(
            omgjøringInnvilgelse(),
            innvilgelseSkjema(førsteHalvår, [
                innvilgelsesperiode(periode('2025-01-01', '2025-01-31')),
                innvilgelsesperiode(periode('2025-03-01', '2025-06-30')),
            ]),
            sakMedInnvilgetVedtak(førsteHalvår),
        );

        expect(resultat).toEqual({
            errors: [],
            warnings: ['Valgte innvilgelsesperioder fører til et delvis opphør'],
        });
    });

    test('validerer barnetillegg mot søknaden fra siste vedtatte søknadsbehandling', () => {
        const sakMedBarnISøknaden = sakMedInnvilgetVedtak(førsteHalvår, {
            søknadsbehandling: søknadsbehandlingInnvilgelse({
                id: 'beh_vedtatt',
                status: Rammebehandlingsstatus.VEDTATT,
                iverksattTidspunkt: tilTidspunkt('2025-01-01T09:00:00'),
                søknad: søknad([søknadBarn('2020-05-05')]),
            }),
        });

        const resultat = revurderingOmgjøringValidering(
            omgjøringInnvilgelse(),
            innvilgelseSkjema(førsteHalvår, [innvilgelsesperiode(førsteHalvår)]),
            sakMedBarnISøknaden,
        );

        expect(resultat).toEqual({
            errors: [],
            warnings: [
                'Det er søkt om barnetillegg, men barnetillegg er ikke innvilget - Forventet barnetillegg fra søknad: 1 barn i perioden 01.01.2025 - 30.06.2025',
            ],
        });
    });

    test('krever valgt innvilgelsesperiode, uten å sjekke vedtaksperiodens grenser', () => {
        const resultat = revurderingOmgjøringValidering(
            omgjøringInnvilgelse(),
            {
                ...skjemaBase,
                resultat: RevurderingResultat.OMGJØRING,
                vedtaksperiode: førsteHalvår,
                innvilgelse: { harValgtPeriode: false, innvilgelsesperioder: [{ periode: {} }] },
            },
            sakMedInnvilgetVedtak(februarTilJuni),
        );

        expect(resultat).toEqual({
            errors: ['Minst en fullstendig innvilgelsesperiode må være valgt'],
            warnings: [],
        });
    });
});
