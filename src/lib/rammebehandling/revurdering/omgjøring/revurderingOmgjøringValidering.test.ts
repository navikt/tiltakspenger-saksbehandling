import { describe, expect, test } from '@jest/globals';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { revurderingOmgjøringValidering } from '~/lib/rammebehandling/revurdering/omgjøring/revurderingOmgjøringValidering';
import { OmgjøringContext } from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import {
    Rammebehandlingsstatus,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    HjemmelForOpphør,
    OmgjøringOpphør,
    RevurderingResultat,
} from '~/lib/rammebehandling/typer/Revurdering';
import { Omgjøringsgrad, Rammevedtak, VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import { SakProps } from '~/lib/sak/SakTyper';
import { tilSaksnummer } from '~/lib/sak/Saksnummer';
import { Periode } from '~/types/Periode';

const januar: Periode = { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' };
const februar: Periode = { fraOgMed: '2025-02-01', tilOgMed: '2025-02-28' };
const mars: Periode = { fraOgMed: '2025-03-01', tilOgMed: '2025-03-31' };
const førsteKvartal: Periode = { fraOgMed: '2025-01-01', tilOgMed: '2025-03-31' };

const rammevedtak = (id: VedtakId, periode: Periode): Rammevedtak => ({
    id,
    behandlingId: `beh_${id}`,
    opprettet: '2025-01-01T09:00:00',
    vedtaksdato: '2025-01-01',
    resultat: SøknadsbehandlingResultat.INNVILGELSE,
    opprinneligVedtaksperiode: periode,
    opprinneligInnvilgetPerioder: [periode],
    gjeldendeVedtaksperioder: [periode],
    gjeldendeInnvilgetPerioder: [periode],
    saksbehandler: 'Z123456',
    beslutter: 'Z654321',
    innvilgelsesperioder: null,
    barnetillegg: null,
    gjeldendeBarnetilleggPerioder: [],
    erGjeldende: true,
    gyldigeKommandoer: {},
    omgjortGrad: null,
});

type TidslinjeElement = {
    rammevedtakId: VedtakId;
    periode: Periode;
    tidslinjeResultat: TidslinjeResultat;
};

const sak = (elementer: TidslinjeElement[]): SakProps => ({
    sakId: 'sak_1',
    saksnummer: tilSaksnummer('202501011001'),
    fnr: ikkeSladdet('12345678911'),
    kanSendeInnHelgForMeldekort: false,
    søknader: [],
    åpneBehandlinger: [],
    rammebehandlinger: [],
    klagebehandlinger: [],
    tilbakekrevinger: [],
    alleRammevedtak: elementer.map((it) => rammevedtak(it.rammevedtakId, it.periode)),
    alleKlagevedtak: [],
    meldekortvedtak: [],
    meldekortbehandlinger: {},
    meldeperiodeKjeder: [],
    tidslinje: { elementer },
    innvilgetTidslinje: {
        elementer: elementer.filter(
            (it) =>
                it.tidslinjeResultat !== TidslinjeResultat.STANS &&
                it.tidslinjeResultat !== TidslinjeResultat.OMGJØRING_OPPHØR,
        ),
    },
    utbetalingstidslinje: [],
});

const omgjøringOpphør = (omgjørVedtak: VedtakId, vedtaksperiode: Periode): OmgjøringOpphør => ({
    id: 'beh_1',
    type: Rammebehandlingstype.REVURDERING,
    status: Rammebehandlingsstatus.UNDER_BEHANDLING,
    resultat: RevurderingResultat.OMGJØRING_OPPHØR,
    sakId: 'sak_1',
    saksnummer: tilSaksnummer('202501011001'),
    rammevedtakId: null,
    saksbehandler: 'Z123456',
    beslutter: null,
    saksopplysninger: {
        fødselsdato: ikkeSladdet('1990-01-01'),
        tiltaksdeltagelse: [],
        tiltaksdeltakelserSomFratarRett: [],
        periode: null,
        ytelser: [],
        tiltakspengevedtakFraArena: [],
        oppslagstidspunkt: '2025-01-01T09:00:00',
    },
    attesteringer: [],
    vedtaksperiode,
    fritekstTilVedtaksbrev: ikkeSladdet(null),
    begrunnelseVilkårsvurdering: ikkeSladdet(null),
    avbrutt: null,
    opprettet: '2025-01-01T09:00:00',
    sistEndret: '2025-01-01T09:00:00',
    iverksattTidspunkt: null,
    ventestatus: [],
    venterTil: null,
    utbetaling: null,
    utbetalingskontroll: null,
    klagebehandlingId: null,
    tilbakekrevingId: null,
    skalSendeVedtaksbrev: true,
    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
    prioritering: null,
    gyldigeKommandoer: [],
    manueltBehandlesGrunner: [],
    automatiskOpprettetGrunn: null,
    valgteHjemler: [HjemmelForOpphør.DeltarIkkePåArbeidsmarkedstiltak],
    omgjørVedtak,
    omgjørRammevedtak: [
        { vedtakId: omgjørVedtak, periode: vedtaksperiode, omgjøringsgrad: Omgjøringsgrad.HELT },
    ],
});

const tomtTekstfelt = { ref: { current: null }, getValue: () => null };

const opphørSkjema = (vedtaksperiode: Periode): OmgjøringContext => ({
    resultat: RevurderingResultat.OMGJØRING_OPPHØR,
    vedtaksperiode,
    valgteHjemler: [HjemmelForOpphør.DeltarIkkePåArbeidsmarkedstiltak],
    skalSendeVedtaksbrev: true,
    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
    erPrioritert: false,
    erReadonly: false,
    textAreas: {
        begrunnelse: tomtTekstfelt,
        brevtekst: tomtTekstfelt,
        barnetilleggBegrunnelse: tomtTekstfelt,
        prioriteringBegrunnelse: tomtTekstfelt,
    },
});

describe('revurderingOmgjøringValidering', () => {
    test('godtar opphør over flere vedtak', () => {
        const sakMedTreVedtak = sak([
            {
                rammevedtakId: 'vedtak_1',
                periode: januar,
                tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
            },
            {
                rammevedtakId: 'vedtak_2',
                periode: februar,
                tidslinjeResultat: TidslinjeResultat.REVURDERING_INNVILGELSE,
            },
            {
                rammevedtakId: 'vedtak_3',
                periode: mars,
                tidslinjeResultat: TidslinjeResultat.OMGJØRING_INNVILGELSE,
            },
        ]);

        const validering = revurderingOmgjøringValidering(
            omgjøringOpphør('vedtak_1', førsteKvartal),
            opphørSkjema(førsteKvartal),
            sakMedTreVedtak,
        );

        expect(validering.errors).toEqual([]);
    });

    test('avviser opphør som slutter i en stans', () => {
        const sakMedStans = sak([
            {
                rammevedtakId: 'vedtak_1',
                periode: { fraOgMed: '2025-01-01', tilOgMed: '2025-02-28' },
                tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
            },
            {
                rammevedtakId: 'vedtak_2',
                periode: mars,
                tidslinjeResultat: TidslinjeResultat.STANS,
            },
        ]);

        const validering = revurderingOmgjøringValidering(
            omgjøringOpphør('vedtak_1', førsteKvartal),
            opphørSkjema(førsteKvartal),
            sakMedStans,
        );

        expect(validering.errors).toEqual([
            'Perioden som opphøres må slutte i en gjeldende innvilgelsesperiode',
        ]);
    });

    test('avviser opphør som slutter i et tidligere opphør', () => {
        const sakMedOpphør = sak([
            {
                rammevedtakId: 'vedtak_1',
                periode: { fraOgMed: '2025-01-01', tilOgMed: '2025-02-28' },
                tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
            },
            {
                rammevedtakId: 'vedtak_2',
                periode: mars,
                tidslinjeResultat: TidslinjeResultat.OMGJØRING_OPPHØR,
            },
        ]);

        const validering = revurderingOmgjøringValidering(
            omgjøringOpphør('vedtak_1', førsteKvartal),
            opphørSkjema(førsteKvartal),
            sakMedOpphør,
        );

        expect(validering.errors).toEqual([
            'Perioden som opphøres må slutte i en gjeldende innvilgelsesperiode',
        ]);
    });

    test.each([TidslinjeResultat.STANS, TidslinjeResultat.OMGJØRING_OPPHØR])(
        'godtar opphør over %s med innvilgelse både før og etter',
        (tidslinjeResultat) => {
            const sakMedStansEllerOpphørIMidten = sak([
                {
                    rammevedtakId: 'vedtak_1',
                    periode: januar,
                    tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
                },
                { rammevedtakId: 'vedtak_2', periode: februar, tidslinjeResultat },
                {
                    rammevedtakId: 'vedtak_3',
                    periode: mars,
                    tidslinjeResultat: TidslinjeResultat.REVURDERING_INNVILGELSE,
                },
            ]);
            const vedtaksperiode: Periode = { fraOgMed: '2025-01-15', tilOgMed: '2025-03-15' };

            const validering = revurderingOmgjøringValidering(
                omgjøringOpphør('vedtak_1', vedtaksperiode),
                opphørSkjema(vedtaksperiode),
                sakMedStansEllerOpphørIMidten,
            );

            expect(validering.errors).toEqual([]);
        },
    );

    test('avviser opphør som starter i en stans', () => {
        const sakMedStans = sak([
            {
                rammevedtakId: 'vedtak_1',
                periode: januar,
                tidslinjeResultat: TidslinjeResultat.STANS,
            },
            {
                rammevedtakId: 'vedtak_2',
                periode: { fraOgMed: '2025-02-01', tilOgMed: '2025-03-31' },
                tidslinjeResultat: TidslinjeResultat.REVURDERING_INNVILGELSE,
            },
        ]);

        const validering = revurderingOmgjøringValidering(
            omgjøringOpphør('vedtak_2', førsteKvartal),
            opphørSkjema(førsteKvartal),
            sakMedStans,
        );

        expect(validering.errors).toEqual([
            'Perioden som opphøres må starte i en gjeldende innvilgelsesperiode',
        ]);
    });

    test('avviser en vedtaksperiode som ikke omgjør noe vedtak', () => {
        const sakMedHull = sak([
            {
                rammevedtakId: 'vedtak_1',
                periode: januar,
                tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
            },
            {
                rammevedtakId: 'vedtak_2',
                periode: mars,
                tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
            },
        ]);

        const validering = revurderingOmgjøringValidering(
            omgjøringOpphør('vedtak_1', februar),
            opphørSkjema(februar),
            sakMedHull,
        );

        expect(validering.errors).toEqual(['Valgt vedtaksperiode omgjør ingen tidligere vedtak']);
    });
});
