/** @jest-environment jsdom */
import { describe, expect, test } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { useTidslinjeDateRange } from '~/lib/_felles/tidslinjer/useTidslinjeDateRange';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import { TidslinjeRammevedtak } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import { periode } from '~test/rammebehandling';
import { Periode } from '~/types/Periode';

const tidslinje = (...perioder: Periode[]): TidslinjeRammevedtak => ({
    elementer: perioder.map((p, index) => ({
        rammevedtakId: `vedtak_${index}`,
        periode: p,
        tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
    })),
});

const visning = (result: { current: ReturnType<typeof useTidslinjeDateRange> }) => ({
    start: result.current.startDate,
    slutt: result.current.endDate,
});

describe('useTidslinjeDateRange', () => {
    // Et år med vedtak, fordelt på to elementer: 12 måneder, mens visningen er maks 6
    const helÅr = tidslinje(
        periode('2025-01-01', '2025-06-30'),
        periode('2025-07-01', '2025-12-31'),
    );

    test('viser de siste 6 månedene av tidslinjen når den er lengre enn 6 måneder', () => {
        const { result } = renderHook(() => useTidslinjeDateRange(helÅr));

        expect(visning(result)).toEqual({
            start: new Date(2025, 6, 1),
            slutt: new Date(2026, 0, 1),
        });
    });

    test('blar bakover 4 måneder om gangen, og stopper ved starten av tidslinjen', () => {
        const { result } = renderHook(() => useTidslinjeDateRange(helÅr));

        act(() => result.current.scrollTidslinje(-1));
        expect(visning(result)).toEqual({
            start: new Date(2025, 2, 1),
            slutt: new Date(2025, 8, 1),
        });

        act(() => result.current.scrollTidslinje(-1));
        expect(visning(result)).toEqual({
            start: new Date(2025, 0, 1),
            slutt: new Date(2025, 6, 1),
        });

        act(() => result.current.scrollTidslinje(-1));
        expect(visning(result)).toEqual({
            start: new Date(2025, 0, 1),
            slutt: new Date(2025, 6, 1),
        });
    });

    test('blar fremover 4 måneder om gangen fra starten', () => {
        const { result } = renderHook(() => useTidslinjeDateRange(helÅr));

        act(() => result.current.scrollTidslinje(-3));
        act(() => result.current.scrollTidslinje(1));

        expect(visning(result)).toEqual({
            start: new Date(2025, 4, 1),
            slutt: new Date(2025, 10, 1),
        });
    });

    test('en kort tidslinje vises i sin helhet, og kan ikke blas i', () => {
        const { result } = renderHook(() =>
            useTidslinjeDateRange(tidslinje(periode('2025-01-01', '2025-03-31'))),
        );

        const hele = { start: new Date(2025, 0, 1), slutt: new Date(2025, 3, 1) };
        expect(visning(result)).toEqual(hele);

        act(() => result.current.scrollTidslinje(1));
        expect(visning(result)).toEqual(hele);

        act(() => result.current.scrollTidslinje(-1));
        expect(visning(result)).toEqual(hele);
    });

    test('en påbegynt måned regnes som en hel, slik at siste dag kommer med i visningen', () => {
        const { result } = renderHook(() =>
            useTidslinjeDateRange(tidslinje(periode('2025-01-15', '2025-03-01'))),
        );

        expect(visning(result)).toEqual({
            start: new Date(2025, 0, 15),
            slutt: new Date(2025, 2, 15),
        });
    });
});
