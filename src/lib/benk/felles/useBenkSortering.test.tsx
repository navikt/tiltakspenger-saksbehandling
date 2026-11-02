/** @jest-environment jsdom */
import { describe, expect, jest, test } from '@jest/globals';
import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { useBenkSortering } from './useBenkSortering';
import { BenkSortering } from '../typer/felles';

type Kolonne = 'fnr' | 'status';

const renderSortering = (
    aktivSortering: BenkSortering<Kolonne>,
    query: NextRouter['query'] = {},
    seksjon?: string,
) => {
    const push = jest.fn<NextRouter['push']>();
    const router = { query, push } as unknown as NextRouter;

    const wrapper = ({ children }: { children: ReactNode }) => (
        <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
    );

    const { result } = renderHook(() => useBenkSortering(aktivSortering, seksjon), { wrapper });

    return { result, push };
};

describe('useBenkSortering', () => {
    test('viser den aktive sorteringen i tabellens format', () => {
        expect(renderSortering('fnr,ASC').result.current.sort).toEqual({
            orderBy: 'fnr',
            direction: 'ascending',
        });
        expect(renderSortering('status,DESC').result.current.sort).toEqual({
            orderBy: 'status',
            direction: 'descending',
        });
    });

    test('klikk på den stigende sorterte kolonnen snur til synkende', () => {
        const { result, push } = renderSortering('fnr,ASC');

        act(() => result.current.onSortChange('fnr'));

        expect(push).toHaveBeenCalledWith({ query: { sortering: 'fnr,DESC' } });
    });

    test('klikk på den synkende sorterte kolonnen snur tilbake til stigende', () => {
        const { result, push } = renderSortering('fnr,DESC');

        act(() => result.current.onSortChange('fnr'));

        expect(push).toHaveBeenCalledWith({ query: { sortering: 'fnr,ASC' } });
    });

    test('klikk på en annen kolonne sorterer stigende på den', () => {
        const { result, push } = renderSortering('fnr,DESC');

        act(() => result.current.onSortChange('status'));

        expect(push).toHaveBeenCalledWith({ query: { sortering: 'status,ASC' } });
    });

    test('ny sortering beholder filtrene, men starter på første side igjen', () => {
        const { result, push } = renderSortering('fnr,ASC', {
            tab: 'SØKNADER',
            skjulPåVent: 'true',
            side: '3',
        });

        act(() => result.current.onSortChange('status'));

        expect(push).toHaveBeenCalledWith({
            query: { tab: 'SØKNADER', skjulPåVent: 'true', sortering: 'status,ASC' },
        });
    });

    test('en seksjon i mine-fanen sorteres med sin egen nøkkel, uten å røre de andre', () => {
        const { result, push } = renderSortering(
            'fnr,ASC',
            { tab: 'MINE', 'sortering-MELDEKORT': 'status,DESC' },
            'KLAGE',
        );

        act(() => result.current.onSortChange('fnr'));

        expect(push).toHaveBeenCalledWith({
            query: {
                tab: 'MINE',
                'sortering-MELDEKORT': 'status,DESC',
                'sortering-KLAGE': 'fnr,DESC',
            },
        });
    });

    test('klikk uten kolonne gjør ingenting', () => {
        const { result, push } = renderSortering('fnr,ASC');

        act(() => result.current.onSortChange(undefined));

        expect(push).not.toHaveBeenCalled();
    });
});
