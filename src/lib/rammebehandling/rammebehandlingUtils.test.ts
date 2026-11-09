import { describe, expect, test } from '@jest/globals';
import {
    erRammebehandlingInnvilgelseResultat,
    fyller18ÅrISøknadsperioden,
    hentInnvilgbarePerioder,
    hentInnvilgbarePerioderSomOverlapper,
    hentTiltaksperiode,
    hentTotalInnvilgbarPeriode,
    kanInnvilgeForFlereTiltak,
    journalførNotatEndringFraBeslutter,
} from '~/lib/rammebehandling/rammebehandlingUtils';
import {
    Rammebehandling,
    RammebehandlingResultat,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import {
    InnvilgbarPeriode,
    Tiltaksdeltakelse,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import {
    periode,
    rammevedtak,
    revurderingInnvilgelse,
    sak,
    søknad,
    søknadsbehandlingIkkeValgt,
    søknadsbehandlingInnvilgelse,
    tiltaksdeltakelse,
} from '~test/rammebehandling';
import { ikkeSladdet, sladdet } from '~test/sladdetVerdi';
import { IkkeInnvilgbarSøknad } from '~/lib/søknad/søknadTyper';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { tilTidspunkt } from '~/types/DatoTid';

const medTiltak = <T extends Rammebehandling>(
    behandling: T,
    ...tiltaksdeltagelse: Tiltaksdeltakelse[]
): T => ({
    ...behandling,
    saksopplysninger: { ...behandling.saksopplysninger, tiltaksdeltagelse },
});

const søknadUtenTiltak: IkkeInnvilgbarSøknad = {
    ...søknad(),
    kanInnvilges: false,
    tiltak: null,
    tiltaksdeltakelseperiodeDetErSøktOm: null,
};

const ikkeInnvilgbar = (id: string, fraOgMed: string, tilOgMed: string): Tiltaksdeltakelse => ({
    ...tiltaksdeltakelse(id, periode(fraOgMed, tilOgMed)),
    kanInnvilges: false,
});

describe('hentTiltaksperiode', () => {
    test('går fra første startdato til siste sluttdato blant alle tiltaksdeltakelsene', () => {
        const behandling = medTiltak(
            søknadsbehandlingIkkeValgt(),
            tiltaksdeltakelse('b', periode('2025-03-01', '2025-04-30')),
            ikkeInnvilgbar('a', '2025-02-01', '2025-03-15'),
            tiltaksdeltakelse('c', periode('2025-02-15', '2025-03-31')),
        );

        expect(hentTiltaksperiode(behandling)).toEqual(periode('2025-02-01', '2025-04-30'));
    });

    test('faller tilbake til tiltaket fra søknaden når saksopplysningene er uten tiltak', () => {
        const behandling = medTiltak(søknadsbehandlingIkkeValgt());

        expect(hentTiltaksperiode(behandling)).toEqual(periode('2025-01-01', '2025-06-30'));
    });

    test('gir null når verken saksopplysningene eller søknaden har tiltaksperiode', () => {
        const behandling = medTiltak(søknadsbehandlingIkkeValgt({ søknad: søknadUtenTiltak }));

        expect(hentTiltaksperiode(behandling)).toBeNull();
    });
});

describe('innvilgbare perioder', () => {
    const innvilgbarPeriode = (
        internDeltakelseId: string,
        fraOgMed: string,
        tilOgMed: string,
    ): InnvilgbarPeriode => ({ internDeltakelseId, periode: periode(fraOgMed, tilOgMed) });

    const medInnvilgbarePerioder = <T extends Rammebehandling>(
        behandling: T,
        ...innvilgbarePerioder: InnvilgbarPeriode[]
    ): T => ({ ...behandling, innvilgbarePerioder });

    // Saksopplysningene har en deltakelse som backend ikke har gitt innvilgbare perioder for.
    const behandling = medInnvilgbarePerioder(
        medTiltak(
            søknadsbehandlingIkkeValgt(),
            tiltaksdeltakelse('jan', periode('2025-01-01', '2025-01-31'), 3),
            tiltaksdeltakelse('feb', periode('2025-02-01', '2025-02-28')),
            tiltaksdeltakelse('mar', periode('2025-03-01', '2025-03-31')),
        ),
        innvilgbarPeriode('jan', '2025-01-01', '2025-01-31'),
        innvilgbarPeriode('mar', '2025-03-01', '2025-03-31'),
    );

    test('bruker bare periodene fra backend, med visningsinformasjon fra saksopplysningene', () => {
        expect(hentInnvilgbarePerioder(behandling)).toEqual([
            {
                internDeltakelseId: 'jan',
                periode: periode('2025-01-01', '2025-01-31'),
                typeNavn: 'Arbeidsmarkedsopplæring',
                antallDagerPerUke: 3,
            },
            {
                internDeltakelseId: 'mar',
                periode: periode('2025-03-01', '2025-03-31'),
                typeNavn: 'Arbeidsmarkedsopplæring',
                antallDagerPerUke: null,
            },
        ]);
    });

    test('viser id-en når tiltaksdeltakelsen mangler i saksopplysningene', () => {
        const utenSaksopplysning = medInnvilgbarePerioder(
            medTiltak(søknadsbehandlingIkkeValgt()),
            innvilgbarPeriode('borte', '2025-01-01', '2025-01-31'),
        );

        expect(hentInnvilgbarePerioder(utenSaksopplysning)[0]?.typeNavn).toBe(
            'Tiltak med id borte',
        );
    });

    test('total innvilgbar periode går fra første til siste innvilgbare periode', () => {
        expect(hentTotalInnvilgbarPeriode(behandling)).toEqual(periode('2025-01-01', '2025-03-31'));
    });

    test('total innvilgbar periode er null uten innvilgbare perioder', () => {
        expect(hentTotalInnvilgbarPeriode(medInnvilgbarePerioder(behandling))).toBeNull();
    });

    test('henter innvilgbare perioder som overlapper perioden, også på periodegrensene', () => {
        const perioder = hentInnvilgbarePerioderSomOverlapper(
            behandling,
            periode('2025-01-31', '2025-03-01'),
        );

        expect(perioder.map((it) => it.internDeltakelseId)).toEqual(['jan', 'mar']);
    });

    test('kan innvilge for flere tiltak bare når periodene gjelder ulike tiltaksdeltakelser', () => {
        expect(kanInnvilgeForFlereTiltak(behandling)).toBe(true);
        expect(
            kanInnvilgeForFlereTiltak(
                medInnvilgbarePerioder(
                    behandling,
                    innvilgbarPeriode('jan', '2025-01-01', '2025-01-15'),
                    innvilgbarPeriode('jan', '2025-01-20', '2025-01-31'),
                ),
            ),
        ).toBe(false);
    });
});

describe('erRammebehandlingInnvilgelseResultat', () => {
    test.each<[RammebehandlingResultat, boolean]>([
        [SøknadsbehandlingResultat.INNVILGELSE, true],
        [RevurderingResultat.INNVILGELSE, true],
        [RevurderingResultat.OMGJØRING, true],
        [SøknadsbehandlingResultat.AVSLAG, false],
        [SøknadsbehandlingResultat.IKKE_VALGT, false],
        [RevurderingResultat.STANS, false],
        [RevurderingResultat.OMGJØRING_OPPHØR, false],
        [RevurderingResultat.OMGJØRING_IKKE_VALGT, false],
    ])('%s gir %s', (resultat, forventet) => {
        expect(erRammebehandlingInnvilgelseResultat(resultat)).toBe(forventet);
    });
});

describe('fyller18ÅrISøknadsperioden', () => {
    const medFødselsdato = <T extends Rammebehandling>(behandling: T, fødselsdato: string): T => ({
        ...behandling,
        saksopplysninger: {
            ...behandling.saksopplysninger,
            fødselsdato: ikkeSladdet(fødselsdato),
        },
    });

    describe('for søknadsbehandling', () => {
        // Søknadsperioden er 01.01.2025 - 30.06.2025
        test.each([
            ['på første dag i søknadsperioden', '2007-01-01', true],
            ['på siste dag i søknadsperioden', '2007-06-30', true],
            ['dagen før søknadsperioden', '2006-12-31', false],
            ['dagen etter søknadsperioden', '2007-07-01', false],
        ])('fyller 18 år %s', (_, fødselsdato, forventet) => {
            expect(
                fyller18ÅrISøknadsperioden(
                    medFødselsdato(søknadsbehandlingIkkeValgt(), fødselsdato),
                    sak(),
                ),
            ).toBe(forventet);
        });

        test('gir false når søknaden er uten søknadsperiode', () => {
            const behandling = søknadsbehandlingIkkeValgt({ søknad: søknadUtenTiltak });

            expect(
                fyller18ÅrISøknadsperioden(medFødselsdato(behandling, '2007-03-01'), sak()),
            ).toBe(false);
        });
    });

    test('gir false når fødselsdatoen er sladdet', () => {
        const behandling = søknadsbehandlingIkkeValgt();

        expect(
            fyller18ÅrISøknadsperioden(
                {
                    ...behandling,
                    saksopplysninger: { ...behandling.saksopplysninger, fødselsdato: sladdet },
                },
                sak(),
            ),
        ).toBe(false);
    });

    describe('for revurdering', () => {
        const vedtattSøknadsbehandling = (
            id: RammebehandlingId,
            fraOgMed: string,
            tilOgMed: string,
        ) =>
            søknadsbehandlingInnvilgelse({
                id,
                status: Rammebehandlingsstatus.VEDTATT,
                iverksattTidspunkt: tilTidspunkt('2025-01-01T09:00:00'),
                søknad: {
                    ...søknad(),
                    tiltaksdeltakelseperiodeDetErSøktOm: periode(fraOgMed, tilOgMed),
                },
            });

        const sakMedSøknadsperioder = sak({
            rammebehandlinger: [
                vedtattSøknadsbehandling('beh_1', '2025-01-01', '2025-03-31'),
                vedtattSøknadsbehandling('beh_2', '2025-06-01', '2025-08-31'),
            ],
            alleRammevedtak: [
                rammevedtak('vedtak_1', periode('2025-01-01', '2025-03-31'), {
                    behandlingId: 'beh_1',
                }),
                rammevedtak('vedtak_2', periode('2025-06-01', '2025-08-31'), {
                    behandlingId: 'beh_2',
                }),
            ],
        });

        test.each([
            ['i den første søknadsperioden', '2007-02-01', true],
            ['i den siste søknadsperioden', '2007-08-31', true],
            ['etter alle søknadsperiodene', '2007-09-01', false],
        ])('fyller 18 år %s', (_, fødselsdato, forventet) => {
            expect(
                fyller18ÅrISøknadsperioden(
                    medFødselsdato(revurderingInnvilgelse(), fødselsdato),
                    sakMedSøknadsperioder,
                ),
            ).toBe(forventet);
        });

        test('gir false når saken er uten vedtatte søknadsbehandlinger', () => {
            expect(
                fyller18ÅrISøknadsperioden(
                    medFødselsdato(revurderingInnvilgelse(), '2007-02-01'),
                    sak(),
                ),
            ).toBe(false);
        });
    });
});

describe('journalførNotatEndringFraBeslutter', () => {
    const behandling = søknadsbehandlingInnvilgelse({
        skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: false },
        beslutterEndringer: {
            skalJournalføreNotat: {
                tidspunkt: tilTidspunkt('2025-01-02T09:00:00'),
                vilkårsvurdering: null,
                barnetillegg: { saksbehandler: true, beslutter: false },
            },
        },
    });

    test('sammenligner beslutterens valg med det saksbehandler har lagret for feltet', () => {
        expect(
            journalførNotatEndringFraBeslutter(behandling, 'vilkårsvurdering', false, true),
        ).toEqual({ saksbehandler: true, beslutter: false });
        expect(
            journalførNotatEndringFraBeslutter(behandling, 'vilkårsvurdering', true, true),
        ).toBeNull();
    });

    test('bruker saksbehandlers opprinnelige valg fra en tidligere lagret beslutterendring', () => {
        expect(
            journalførNotatEndringFraBeslutter(behandling, 'barnetillegg', true, true),
        ).toBeNull();
    });

    test('beholder lagret endring når det ikke er beslutter som redigerer', () => {
        expect(journalførNotatEndringFraBeslutter(behandling, 'barnetillegg', true, false)).toEqual(
            {
                saksbehandler: true,
                beslutter: false,
            },
        );
    });
});
