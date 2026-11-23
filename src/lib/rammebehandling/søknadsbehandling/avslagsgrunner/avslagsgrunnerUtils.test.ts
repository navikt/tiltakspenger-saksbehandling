import { describe, expect, test } from '@jest/globals';
import { periode, rammevedtak, sak, søknad, søknadsbehandlingAvslag } from '~test/rammebehandling';
import { Avslagsgrunn } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import { SakProps } from '~/lib/sak/SakTyper';
import { Periode } from '~/types/Periode';
import { totalPeriode } from '~/utils/periode';
import {
    skalVarsleOmManglendeForhåndsutfylling,
    synligeAvslagsgrunner,
} from '~/lib/rammebehandling/søknadsbehandling/avslagsgrunner/avslagsgrunnerUtils';

// Søknaden i testbehandlingen søker om 2025-01-01 til 2025-06-30.
const behandling = søknadsbehandlingAvslag({
    avslagsgrunner: [Avslagsgrunn.InnvilgetTiltakspenger],
});

type InnvilgetVedtak = {
    // Periodene vedtaket innvilget da det ble fattet.
    innvilget: Periode[];
    // Periodene som fortsatt gjelder etter stans eller opphør, og som blir elementer i innvilgetTidslinje.
    gjeldende?: Periode[];
};

const innvilget = (p: Periode): InnvilgetVedtak => ({ innvilget: [p] });

const sakMedVedtak = (...vedtak: InnvilgetVedtak[]): SakProps => {
    const alleRammevedtak = vedtak.map(({ innvilget, gjeldende = innvilget }, index) =>
        rammevedtak(`vedtak_${index + 1}`, totalPeriode(innvilget), {
            opprinneligInnvilgetPerioder: innvilget,
            gjeldendeVedtaksperioder: gjeldende,
            gjeldendeInnvilgetPerioder: gjeldende,
        }),
    );

    return sak({
        alleRammevedtak,
        innvilgetTidslinje: {
            elementer: alleRammevedtak.flatMap((v) =>
                v.gjeldendeInnvilgetPerioder.map((p) => ({
                    rammevedtakId: v.id,
                    periode: p,
                    tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
                })),
            ),
        },
    });
};

const sakMedKortereInnvilgelse = () => sakMedVedtak(innvilget(periode('2025-01-01', '2025-03-31')));

describe('skalVarsleOmManglendeForhåndsutfylling', () => {
    test.each([
        {
            tilfelle: 'varsler ikke når omgjøringen innvilger hele vedtaksperioden',
            vedtaksperiode: periode('2025-06-01', '2025-06-03'),
            skalVarsle: false,
        },
        {
            tilfelle: 'varsler når omgjøringen innvilger søknadsperioden og opphører resten',
            vedtaksperiode: periode('2025-06-01', '2025-06-05'),
            skalVarsle: true,
        },
    ])('$tilfelle', ({ vedtaksperiode, skalVarsle }) => {
        const søknadsperiode = periode('2025-06-01', '2025-06-03');
        const avslag = søknadsbehandlingAvslag({
            søknad: { ...søknad(), tiltaksdeltakelseperiodeDetErSøktOm: søknadsperiode },
            vedtaksperiode: søknadsperiode,
            avslagsgrunner: [Avslagsgrunn.InnvilgetTiltakspenger],
        });
        const omgjøring = rammevedtak('vedtak_1', vedtaksperiode, {
            resultat: RevurderingResultat.OMGJØRING,
            opprinneligInnvilgetPerioder: [søknadsperiode],
            gjeldendeInnvilgetPerioder: [søknadsperiode],
        });
        const sakMedOmgjøring = sak({
            alleRammevedtak: [omgjøring],
            innvilgetTidslinje: {
                elementer: [
                    {
                        rammevedtakId: omgjøring.id,
                        periode: søknadsperiode,
                        tidslinjeResultat: TidslinjeResultat.OMGJØRING_INNVILGELSE,
                    },
                ],
            },
        });

        const resultat = skalVarsleOmManglendeForhåndsutfylling(
            sakMedOmgjøring,
            avslag,
            avslag.avslagsgrunner,
        );

        expect(resultat).toBe(skalVarsle);
    });

    test('varsler ikke når søknadsperioden er lik hele perioden i vedtaket', () => {
        const sakMedLikInnvilgelse = sakMedVedtak(innvilget(periode('2025-01-01', '2025-06-30')));

        const resultat = skalVarsleOmManglendeForhåndsutfylling(sakMedLikInnvilgelse, behandling, [
            Avslagsgrunn.InnvilgetTiltakspenger,
        ]);

        expect(resultat).toBe(false);
    });

    test('varsler ikke når søknadsperioden er lik hele perioden i ett av flere vedtak', () => {
        const sakMedLikInnvilgelseBlantFlere = sakMedVedtak(
            innvilget(periode('2024-07-01', '2024-12-31')),
            innvilget(periode('2025-01-01', '2025-06-30')),
        );

        const resultat = skalVarsleOmManglendeForhåndsutfylling(
            sakMedLikInnvilgelseBlantFlere,
            behandling,
            [Avslagsgrunn.InnvilgetTiltakspenger],
        );

        expect(resultat).toBe(false);
    });

    test('varsler når søknadsperioden er lengre enn den innvilgede perioden', () => {
        const resultat = skalVarsleOmManglendeForhåndsutfylling(
            sakMedKortereInnvilgelse(),
            behandling,
            [Avslagsgrunn.InnvilgetTiltakspenger],
        );

        expect(resultat).toBe(true);
    });

    test('varsler når søknadsperioden er kortere enn den innvilgede perioden', () => {
        const sakMedLengreInnvilgelse = sakMedVedtak(
            innvilget(periode('2024-07-01', '2025-12-31')),
        );

        const resultat = skalVarsleOmManglendeForhåndsutfylling(
            sakMedLengreInnvilgelse,
            behandling,
            [Avslagsgrunn.InnvilgetTiltakspenger],
        );

        expect(resultat).toBe(true);
    });

    test('varsler når søknadsperioden dekker to tilstøtende vedtak', () => {
        const sakMedToVedtak = sakMedVedtak(
            innvilget(periode('2025-01-01', '2025-03-31')),
            innvilget(periode('2025-04-01', '2025-06-30')),
        );

        const resultat = skalVarsleOmManglendeForhåndsutfylling(sakMedToVedtak, behandling, [
            Avslagsgrunn.InnvilgetTiltakspenger,
        ]);

        expect(resultat).toBe(true);
    });

    // Tidslinja har et element med lik periode, men det er bare den delen av vedtaket som ikke er stanset.
    test('varsler når søknadsperioden er lik den delen av et delvis stanset vedtak som gjelder', () => {
        const sakMedDelvisStansetVedtak = sakMedVedtak({
            innvilget: [periode('2025-01-01', '2025-12-31')],
            gjeldende: [periode('2025-01-01', '2025-06-30')],
        });

        const resultat = skalVarsleOmManglendeForhåndsutfylling(
            sakMedDelvisStansetVedtak,
            behandling,
            [Avslagsgrunn.InnvilgetTiltakspenger],
        );

        expect(resultat).toBe(true);
    });

    // Tidslinja har et element med lik periode, men det er bare den ene av to perioder i vedtaket.
    test('varsler når søknadsperioden er lik den ene perioden i et vedtak med opphold', () => {
        const sakMedOppholdIVedtaket = sakMedVedtak({
            innvilget: [periode('2024-07-01', '2024-10-31'), periode('2025-01-01', '2025-06-30')],
        });

        const resultat = skalVarsleOmManglendeForhåndsutfylling(
            sakMedOppholdIVedtaket,
            behandling,
            [Avslagsgrunn.InnvilgetTiltakspenger],
        );

        expect(resultat).toBe(true);
    });

    test('varsler når saken ikke har noen innvilgelser', () => {
        const sakUtenInnvilgelser = sakMedVedtak();

        const resultat = skalVarsleOmManglendeForhåndsutfylling(sakUtenInnvilgelser, behandling, [
            Avslagsgrunn.InnvilgetTiltakspenger,
        ]);

        expect(resultat).toBe(true);
    });

    test('varsler ikke når allerede innvilget tiltakspenger ikke er valgt', () => {
        const resultat = skalVarsleOmManglendeForhåndsutfylling(
            sakMedKortereInnvilgelse(),
            behandling,
            [Avslagsgrunn.Alder],
        );

        expect(resultat).toBe(false);
    });

    test('varsler ikke når søknaden mangler periode', () => {
        const behandlingUtenSøknadsperiode = søknadsbehandlingAvslag({
            søknad: {
                ...søknad(),
                kanInnvilges: false,
                tiltak: null,
                tiltaksdeltakelseperiodeDetErSøktOm: null,
            },
        });

        const resultat = skalVarsleOmManglendeForhåndsutfylling(
            sakMedKortereInnvilgelse(),
            behandlingUtenSøknadsperiode,
            [Avslagsgrunn.InnvilgetTiltakspenger],
        );

        expect(resultat).toBe(false);
    });

    test.each([Rammebehandlingsstatus.VEDTATT, Rammebehandlingsstatus.AVBRUTT])(
        'varsler ikke når behandlingen er avsluttet med status %s',
        (status) => {
            const avsluttetBehandling = { ...behandling, status };

            const resultat = skalVarsleOmManglendeForhåndsutfylling(
                sakMedKortereInnvilgelse(),
                avsluttetBehandling,
                [Avslagsgrunn.InnvilgetTiltakspenger],
            );

            expect(resultat).toBe(false);
        },
    );
});

describe('synligeAvslagsgrunner', () => {
    test('skjuler InnvilgetTiltakspenger når toggle er av', () => {
        const resultat = synligeAvslagsgrunner(false, []);

        expect(resultat).not.toContain(Avslagsgrunn.InnvilgetTiltakspenger);
        expect(resultat).toHaveLength(Object.values(Avslagsgrunn).length - 1);
    });

    test('viser InnvilgetTiltakspenger når toggle er på', () => {
        const resultat = synligeAvslagsgrunner(true, []);

        expect(resultat).toEqual(Object.values(Avslagsgrunn));
    });

    test('viser InnvilgetTiltakspenger når toggle er av, men grunnen allerede er valgt', () => {
        const resultat = synligeAvslagsgrunner(false, [Avslagsgrunn.InnvilgetTiltakspenger]);

        expect(resultat).toContain(Avslagsgrunn.InnvilgetTiltakspenger);
    });
});
