/** @jest-environment jsdom */
import { expect, test } from '@jest/globals';
import { act, fireEvent, renderHook } from '@testing-library/react';
import { useCtrlHoldesInne } from '~/utils/useCtrlHoldesInne';

test('er true mens ctrl holdes inne', () => {
    const { result } = renderHook(() => useCtrlHoldesInne());
    expect(result.current).toBe(false);

    fireEvent.keyDown(window, { key: 'Control', ctrlKey: true });
    expect(result.current).toBe(true);

    fireEvent.keyUp(window, { key: 'Control', ctrlKey: false });
    expect(result.current).toBe(false);
});

test('nullstilles når vinduet mister fokus mens ctrl holdes inne', () => {
    const { result } = renderHook(() => useCtrlHoldesInne());

    fireEvent.keyDown(window, { key: 'Control', ctrlKey: true });
    act(() => {
        window.dispatchEvent(new Event('blur'));
    });

    expect(result.current).toBe(false);
});
