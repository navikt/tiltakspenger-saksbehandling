import { describe, expect, test } from '@jest/globals';
import { barnetilleggFørBehandlingIPeriode } from '~/lib/rammebehandling/felles/barnetillegg/utils/hentBarnetilleggFraVedtakTidslinje';
import {
    barnetilleggPeriode,
    periode,
    revurderingInnvilgelse,
    sakMedInnvilgetVedtak,
} from '~test/rammebehandling';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    TidslinjeFørOgEtterElement,
    TidslinjeResultat,
} from '~/lib/_felles/tidslinjer/tidslinjeTyper';

const førsteHalvår = periode('2025-01-01', '2025-06-30');
const førsteKvartal = periode('2025-01-01', '2025-03-31');
const andreKvartal = periode('2025-04-01', '2025-06-30');

// Det gjeldende vedtaket har 2 barn, og er vedtaket til revurderingen i testene som er vedtatt
const sak = sakMedInnvilgetVedtak(førsteHalvår, {
    vedtak: { gjeldendeBarnetilleggPerioder: [barnetilleggPeriode(2, førsteHalvår)] },
});

const tidslinjeElement = (
    p: typeof førsteHalvår,
    tidslinjeResultat: TidslinjeResultat,
    antallBarn: number | null,
): TidslinjeFørOgEtterElement => ({
    periode: p,
    tidslinjeResultat,
    behandlingId: 'beh_tidligere',
    rammevedtakId: 'vedtak_tidligere',
    antallDagerPerMeldeperiode: antallBarn === null ? null : 10,
    antallBarn,
});

describe('barnetilleggFørBehandlingIPeriode', () => {
    test('bruker gjeldende vedtak for en behandling som ikke er vedtatt', () => {
        const behandling = revurderingInnvilgelse({
            status: Rammebehandlingsstatus.UNDER_BEHANDLING,
        });

        expect(barnetilleggFørBehandlingIPeriode(sak, behandling, førsteHalvår)).toEqual([
            { ...barnetilleggPeriode(2, førsteHalvår), behandlingId: 'beh_vedtatt' },
        ]);
    });

    test('bruker tidslinjen før behandlingens eget vedtak for en vedtatt behandling, uten stansede perioder', () => {
        const behandling = revurderingInnvilgelse({
            status: Rammebehandlingsstatus.VEDTATT,
            tidslinjeFørOgEtter: {
                periode: førsteHalvår,
                før: [
                    tidslinjeElement(
                        førsteKvartal,
                        TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
                        1,
                    ),
                    tidslinjeElement(andreKvartal, TidslinjeResultat.STANS, null),
                ],
                etter: [],
                harEndring: true,
            },
        });

        expect(
            barnetilleggFørBehandlingIPeriode(sak, behandling, periode('2025-02-01', '2025-06-30')),
        ).toEqual([
            {
                ...barnetilleggPeriode(1, periode('2025-02-01', '2025-03-31')),
                behandlingId: 'beh_tidligere',
            },
        ]);
    });
});
