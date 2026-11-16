import { describe, expect, test } from '@jest/globals';
import { periode, sak } from '~test/rammebehandling';
import { Avslagsgrunn } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import { SakProps } from '~/lib/sak/SakTyper';
import { Periode } from '~/types/Periode';
import { skalVarsleOmFlereTidligereInnvilgelser } from '~/lib/rammebehandling/søknadsbehandling/avslagsgrunner/avslagsgrunnerUtils';

const søknadsperiode = periode('2025-01-01', '2025-06-30');

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
            søknadsperiode,
            avslagsgrunner,
        );

        expect(resultat).toBe(true);
    });

    test('varsler ikke når søknadsperioden overlapper én innvilgelse', () => {
        const sakMedÉnInnvilgelse = sakMedInnvilgelser(periode('2025-01-01', '2025-06-30'));
        const avslagsgrunner = [Avslagsgrunn.InnvilgetTiltakspenger];

        const resultat = skalVarsleOmFlereTidligereInnvilgelser(
            sakMedÉnInnvilgelse,
            søknadsperiode,
            avslagsgrunner,
        );

        expect(resultat).toBe(false);
    });

    test('varsler ikke når saken ikke har noen innvilgelser', () => {
        const sakUtenInnvilgelser = sakMedInnvilgelser();
        const avslagsgrunner = [Avslagsgrunn.InnvilgetTiltakspenger];

        const resultat = skalVarsleOmFlereTidligereInnvilgelser(
            sakUtenInnvilgelser,
            søknadsperiode,
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
            søknadsperiode,
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
            søknadsperiode,
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
        const søknadUtenPeriode = null;

        const resultat = skalVarsleOmFlereTidligereInnvilgelser(
            sakMedToInnvilgelser,
            søknadUtenPeriode,
            avslagsgrunner,
        );

        expect(resultat).toBe(false);
    });
});
