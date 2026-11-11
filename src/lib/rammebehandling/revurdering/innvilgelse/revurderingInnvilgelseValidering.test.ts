import { describe, expect, test } from '@jest/globals';
import { revurderingInnvilgelseValidering } from '~/lib/rammebehandling/revurdering/innvilgelse/revurderingInnvilgelseValidering';
import { RevurderingInnvilgelseContext } from '~/lib/rammebehandling/context/revurdering/revurderingInnvilgelseSkjemaContext';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import { Tidspunkt, tilTidspunkt } from '~/types/DatoTid';
import {
    innvilgelsesperiode,
    periode,
    rammevedtak,
    revurderingInnvilgelse,
    sak,
    søknad,
    søknadBarn,
    søknadsbehandlingInnvilgelse,
    lagretInnvilgelsesperiode,
} from '~test/rammebehandling';

const tomtTekstfelt = { ref: { current: null }, getValue: () => null };

const førsteHalvår = periode('2025-01-01', '2025-06-30');

const skjemaUtenBarnetillegg: RevurderingInnvilgelseContext = {
    resultat: RevurderingResultat.INNVILGELSE,
    innvilgelse: {
        harValgtPeriode: true,
        innvilgelsesperioder: [innvilgelsesperiode(førsteHalvår)],
        harBarnetillegg: false,
        barnetilleggPerioder: [],
    },
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

// Sak med to vedtatte søknadsbehandlinger, der bare den første søknaden har barn
const sakMedToSøknadsbehandlinger = (iverksattMedBarn: Tidspunkt, iverksattUtenBarn: Tidspunkt) => {
    const medBarn = søknadsbehandlingInnvilgelse({
        id: 'beh_med_barn',
        status: Rammebehandlingsstatus.VEDTATT,
        iverksattTidspunkt: iverksattMedBarn,
        søknad: søknad([søknadBarn('2020-05-05')]),
    });
    const utenBarn = søknadsbehandlingInnvilgelse({
        id: 'beh_uten_barn',
        status: Rammebehandlingsstatus.VEDTATT,
        iverksattTidspunkt: iverksattUtenBarn,
    });

    return sak({
        rammebehandlinger: [medBarn, utenBarn],
        alleRammevedtak: [
            rammevedtak('vedtak_1', førsteHalvår, { behandlingId: medBarn.id }),
            rammevedtak('vedtak_2', førsteHalvår, { behandlingId: utenBarn.id }),
        ],
        tidslinje: {
            elementer: [
                {
                    rammevedtakId: 'vedtak_2',
                    periode: førsteHalvår,
                    tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
                },
            ],
        },
    });
};

describe('revurderingInnvilgelseValidering', () => {
    test('validerer barnetillegg mot søknaden fra sist iverksatte søknadsbehandling', () => {
        const resultat = revurderingInnvilgelseValidering(
            revurderingInnvilgelse(),
            skjemaUtenBarnetillegg,
            sakMedToSøknadsbehandlinger(
                tilTidspunkt('2025-01-01T09:00:00'),
                tilTidspunkt('2025-02-01T09:00:00'),
            ),
        );

        expect(resultat).toEqual({ errors: [], warnings: [] });
    });

    test('advarer om manglende barnetillegg når siste søknad har barn', () => {
        const resultat = revurderingInnvilgelseValidering(
            revurderingInnvilgelse(),
            skjemaUtenBarnetillegg,
            sakMedToSøknadsbehandlinger(
                tilTidspunkt('2025-02-01T09:00:00'),
                tilTidspunkt('2025-01-01T09:00:00'),
            ),
        );

        expect(resultat).toEqual({
            errors: [],
            warnings: [
                'Det er søkt om barnetillegg, men barnetillegg er ikke innvilget - Forventet barnetillegg fra søknad: 1 barn i perioden 01.01.2025 - 30.06.2025',
            ],
        });
    });

    test('avviser en lagret innvilgelse som backend har validert at ikke passer med tiltaksdeltakelsen', () => {
        const innvilgetPeriode = periode('2025-01-01', '2025-06-30');

        const resultat = revurderingInnvilgelseValidering(
            revurderingInnvilgelse({
                innvilgelsesperioder: [
                    lagretInnvilgelsesperiode(innvilgetPeriode, {
                        ugyldigTiltaksdeltakelse: {
                            type: 'KAN_IKKE_INNVILGES',
                            deltakelsesperiode: null,
                        },
                    }),
                ],
            }),
            {
                ...skjemaUtenBarnetillegg,
                innvilgelse: {
                    ...skjemaUtenBarnetillegg.innvilgelse,
                    innvilgelsesperioder: [innvilgelsesperiode(innvilgetPeriode)],
                },
            },
            sakMedToSøknadsbehandlinger(
                tilTidspunkt('2025-01-01T09:00:00'),
                tilTidspunkt('2025-02-01T09:00:00'),
            ),
        );

        expect(resultat.errors).toEqual(['Kan ikke innvilge for valgt tiltaksdeltakelse']);
    });
});
