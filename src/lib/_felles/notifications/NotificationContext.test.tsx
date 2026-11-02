/** @jest-environment jsdom */
import { describe, expect, jest, test } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import {
    AppRouterContext,
    AppRouterInstance,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { NotificationProvider, useNotification } from './NotificationContext';

const renderNotification = () => {
    const push = jest.fn<AppRouterInstance['push']>();
    const router = { push } as unknown as AppRouterInstance;

    const wrapper = ({ children }: { children: ReactNode }) => (
        <AppRouterContext.Provider value={router}>
            <NotificationProvider>{children}</NotificationProvider>
        </AppRouterContext.Provider>
    );

    const { result } = renderHook(() => useNotification(), { wrapper });

    return { result, push };
};

describe('NotificationContext', () => {
    test('en varsling kan bare hentes ut én gang', () => {
        const { result } = renderNotification();

        act(() => result.current.setNotification('Behandlingen er lagret'));
        expect(result.current.notification).toBe('Behandlingen er lagret');

        let hentet: string | null = null;
        act(() => {
            hentet = result.current.consumeNotification();
        });

        expect(hentet).toBe('Behandlingen er lagret');
        expect(result.current.notification).toBeNull();

        act(() => {
            hentet = result.current.consumeNotification();
        });
        expect(hentet).toBeNull();
    });

    test('navigering med varsling setter varslingen og navigerer til stien', () => {
        const { result, push } = renderNotification();

        act(() => result.current.navigateWithNotification('/sak/123', 'Vedtaket er sendt'));

        expect(push).toHaveBeenCalledWith('/sak/123');
        expect(result.current.notification).toBe('Vedtaket er sendt');
    });

    test('hooken kaster utenfor provideren', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => renderHook(() => useNotification())).toThrow(
            'useNotification must be used within a NotificationProvider',
        );
    });
});
