/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { RichTooltip } from './RichTooltip';

const renderTooltip = (holdÅpenVedHover: boolean) =>
    render(
        <RichTooltip content={'Innhold i tooltip'} holdÅpenVedHover={holdÅpenVedHover}>
            <span>{'Anker'}</span>
        </RichTooltip>,
    );

const tooltip = () => screen.getByText('Innhold i tooltip');

/** Aksel skjuler en lukket popover med css, som ikke lastes i jsdom, så åpen leses fra aria-hidden. */
const erÅpen = () => tooltip().closest('[aria-hidden]')?.getAttribute('aria-hidden') === 'false';

describe('RichTooltip', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    test('lukkes med en gang pekeren forlater ankeret som standard', () => {
        renderTooltip(false);

        fireEvent.mouseEnter(screen.getByText('Anker'));
        expect(erÅpen()).toBe(true);

        fireEvent.mouseLeave(screen.getByText('Anker'));
        expect(erÅpen()).toBe(false);
    });

    test('holdes åpen når pekeren flyttes fra ankeret til tooltipen', () => {
        renderTooltip(true);

        fireEvent.mouseEnter(screen.getByText('Anker'));
        fireEvent.mouseLeave(screen.getByText('Anker'));
        fireEvent.mouseEnter(tooltip());
        act(() => jest.runAllTimers());

        expect(erÅpen()).toBe(true);
    });

    test('lukkes når pekeren forlater både ankeret og tooltipen', () => {
        renderTooltip(true);

        fireEvent.mouseEnter(screen.getByText('Anker'));
        fireEvent.mouseLeave(screen.getByText('Anker'));
        act(() => jest.runAllTimers());

        expect(erÅpen()).toBe(false);
    });
});
