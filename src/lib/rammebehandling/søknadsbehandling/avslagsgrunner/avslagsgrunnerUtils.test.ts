import { describe, expect, test } from '@jest/globals';
import { periode, sak, søknad, søknadsbehandlingAvslag } from '~test/rammebehandling';
import { Avslagsgrunn } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import { SakProps } from '~/lib/sak/SakTyper';
import { Periode } from '~/types/Periode';
import {
    skalVarsleOmFlereTidligereInnvilgelser,
    synligeAvslagsgrunner,
} from '~/lib/rammebehandling/søknadsbehandling/avslagsgrunner/avslagsgrunnerUtils';

// Søknaden i testbehandlingen søker om 2025-01-01 til 2025-06-30.
const behandling = søknadsbehandlingAvslag({
    avslagsgrunner: [Avslagsgrunn.InnvilgetTiltakspenger],
});

const sakMedInnvilgelser = (...perioder: Periode[]): SakProps =>
    sak({
        innvilgetTidslinje: {
            elementer: perioder.map((p, index) => ({
                rammevedtakId: `vedtak_${index + 1}`,
                periode: p,
                tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
            })),
        },
    });

describe('skalVarsleOmFlereTidligereInnvilgelser', () => {
    test('varsler når søknadsperioden overlapper flere innvilgelser', () => {
        const sakMedToInnvilgelser = sakMedInnvilgelser(
            periode('2025-01-01', '2025-03-31'),
            periode('2025-04-01', '2025-06-30'),
        );
        const avslagsgrunner = [Avslagsgrunn.InnvilgetTiltakspenger];

        const resultat = skalVarsleOmFlereTidligereInnvilgelser(
            sakMedToInnvilgelser,
            behandling,
            avslagsgrunner,
        );

        expect(resultat).toBe(true);
    });

    test('varsler ikke når søknadsperioden overlapper én innvilgelse', () => {
        const sakMedÉnInnvilgelse = sakMedInnvilgelser(periode('2025-01-01', '2025-06-30'));
        const avslagsgrunner = [Avslagsgrunn.InnvilgetTiltakspenger];

        const resultat = skalVarsleOmFlereTidligereInnvilgelser(
            sakMedÉnInnvilgelse,
            behandling,
            avslagsgrunner,
        );

        expect(resultat).toBe(false);
    });

    test('varsler ikke når saken ikke har noen innvilgelser', () => {
        const sakUtenInnvilgelser = sakMedInnvilgelser();
        const avslagsgrunner = [Avslagsgrunn.InnvilgetTiltakspenger];

        const resultat = skalVarsleOmFlereTidligereInnvilgelser(
            sakUtenInnvilgelser,
            behandling,
            avslagsgrunner,
        );

        expect(resultat).toBe(false);
    });

    test('teller ikke innvilgelser utenfor søknadsperioden', () => {
        const sakMedÉnInnvilgelseUtenfor = sakMedInnvilgelser(
            periode('2024-07-01', '2024-12-31'),
            periode('2025-01-01', '2025-06-30'),
        );
        const avslagsgrunner = [Avslagsgrunn.InnvilgetTiltakspenger];

        const resultat = skalVarsleOmFlereTidligereInnvilgelser(
            sakMedÉnInnvilgelseUtenfor,
            behandling,
            avslagsgrunner,
        );

        expect(resultat).toBe(false);
    });

    test('varsler ikke når allerede innvilget tiltakspenger ikke er valgt', () => {
        const sakMedToInnvilgelser = sakMedInnvilgelser(
            periode('2025-01-01', '2025-03-31'),
            periode('2025-04-01', '2025-06-30'),
        );
        const avslagsgrunner = [Avslagsgrunn.Alder];

        const resultat = skalVarsleOmFlereTidligereInnvilgelser(
            sakMedToInnvilgelser,
            behandling,
            avslagsgrunner,
        );

        expect(resultat).toBe(false);
    });

    test('varsler ikke når søknaden mangler periode', () => {
        const sakMedToInnvilgelser = sakMedInnvilgelser(
            periode('2025-01-01', '2025-03-31'),
            periode('2025-04-01', '2025-06-30'),
        );
        const avslagsgrunner = [Avslagsgrunn.InnvilgetTiltakspenger];
        const behandlingUtenSøknadsperiode = søknadsbehandlingAvslag({
            søknad: {
                ...søknad(),
                kanInnvilges: false,
                tiltak: null,
                tiltaksdeltakelseperiodeDetErSøktOm: null,
            },
        });

        const resultat = skalVarsleOmFlereTidligereInnvilgelser(
            sakMedToInnvilgelser,
            behandlingUtenSøknadsperiode,
            avslagsgrunner,
        );

        expect(resultat).toBe(false);
    });

    test.each([Rammebehandlingsstatus.VEDTATT, Rammebehandlingsstatus.AVBRUTT])(
        'varsler ikke når behandlingen er avsluttet med status %s',
        (status) => {
            const sakMedToInnvilgelser = sakMedInnvilgelser(
                periode('2025-01-01', '2025-03-31'),
                periode('2025-04-01', '2025-06-30'),
            );
            const avslagsgrunner = [Avslagsgrunn.InnvilgetTiltakspenger];
            const avsluttetBehandling = { ...behandling, status };

            const resultat = skalVarsleOmFlereTidligereInnvilgelser(
                sakMedToInnvilgelser,
                avsluttetBehandling,
                avslagsgrunner,
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
