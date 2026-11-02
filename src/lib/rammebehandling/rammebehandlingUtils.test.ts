import { describe, expect, test } from '@jest/globals';
import {
    erRammebehandlingInnvilgelseResultat,
    fyller18ÅrISøknadsperioden,
    hentHeleTiltaksdeltakelsesperioden,
    hentInnvilgbareTiltaksdeltakelserFraPeriode,
    hentTiltaksperiode,
    journalførNotatEndringFraBeslutter,
} from '~/lib/rammebehandling/rammebehandlingUtils';
import {
    Rammebehandling,
    RammebehandlingResultat,
    Rammebehandlingsstatus,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { Tiltaksdeltakelse } from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
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

describe('innvilgbare tiltaksdeltakelser', () => {
    const behandling = medTiltak(
        søknadsbehandlingIkkeValgt(),
        tiltaksdeltakelse('jan', periode('2025-01-01', '2025-01-31')),
        ikkeInnvilgbar('feb', '2025-02-01', '2025-02-28'),
        tiltaksdeltakelse('mar', periode('2025-03-01', '2025-03-31')),
    );

    test('hele tiltaksdeltakelsesperioden tar bare med deltakelser som kan innvilges', () => {
        expect(
            hentHeleTiltaksdeltakelsesperioden(
                medTiltak(
                    behandling,
                    ikkeInnvilgbar('des', '2024-12-01', '2024-12-31'),
                    tiltaksdeltakelse('jan', periode('2025-01-01', '2025-01-31')),
                    tiltaksdeltakelse('mar', periode('2025-03-01', '2025-03-31')),
                ),
            ),
        ).toEqual(periode('2025-01-01', '2025-03-31'));
    });

    test('hele tiltaksdeltakelsesperioden er null uten innvilgbare deltakelser', () => {
        expect(
            hentHeleTiltaksdeltakelsesperioden(
                medTiltak(behandling, ikkeInnvilgbar('feb', '2025-02-01', '2025-02-28')),
            ),
        ).toBeNull();
    });

    test('henter innvilgbare deltakelser som overlapper perioden, også på periodegrensene', () => {
        const deltakelser = hentInnvilgbareTiltaksdeltakelserFraPeriode(
            behandling,
            periode('2025-01-31', '2025-03-01'),
        );

        expect(deltakelser.map((d) => d.internDeltakelseId)).toEqual(['jan', 'mar']);
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
                iverksattTidspunkt: '2025-01-01T09:00:00',
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
                tidspunkt: '2025-01-02T09:00:00',
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
