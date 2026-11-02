/** @jest-environment jsdom */
import { describe, expect, test } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { useResettableState } from '~/utils/useResettableState';

describe('useResettableState', () => {
    test('starter med initialverdien og kan endres lokalt', () => {
        const { result } = renderHook(() => useResettableState('fra backend'));

        act(() => result.current[1]('lokal endring'));

        expect(result.current[0]).toBe('lokal endring');
    });

    test('lokal endring beholdes ved re-render med samme initialverdi', () => {
        const { result, rerender } = renderHook(({ verdi }) => useResettableState(verdi), {
            initialProps: { verdi: 'fra backend' },
        });

        act(() => result.current[1]('lokal endring'));
        rerender({ verdi: 'fra backend' });

        expect(result.current[0]).toBe('lokal endring');
    });

    test('ny initialverdi overskriver lokale endringer', () => {
        const { result, rerender } = renderHook(({ verdi }) => useResettableState(verdi), {
            initialProps: { verdi: 'fra backend' },
        });

        act(() => result.current[1]('lokal endring'));
        rerender({ verdi: 'ny verdi fra backend' });

        expect(result.current[0]).toBe('ny verdi fra backend');
    });

    test('objekter sammenlignes på referanse, så et nytt objekt med likt innhold resetter også', () => {
        const { result, rerender } = renderHook(({ verdi }) => useResettableState(verdi), {
            initialProps: { verdi: { antall: 1 } },
        });

        act(() => result.current[1]({ antall: 5 }));
        rerender({ verdi: { antall: 1 } });

        expect(result.current[0]).toEqual({ antall: 1 });
    });
});
