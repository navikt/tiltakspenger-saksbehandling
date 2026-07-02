/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { SakId } from '~/lib/sak/SakTyper';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { AvsluttMeldekortbehandlingModal } from './AvsluttMeldekortbehandling';

// jsdom implementerer ikke <dialog>, som Aksel sin Modal baserer seg på.
beforeAll(() => {
    HTMLDialogElement.prototype.showModal = jest.fn(function (this: HTMLDialogElement) {
        this.open = true;
    });
    HTMLDialogElement.prototype.close = jest.fn(function (this: HTMLDialogElement) {
        this.open = false;
    });
});

const originalFetch = global.fetch;

// Stubber nettverkslaget slik at avbryt-kallet svarer med gitt HTTP-status.
const stubFetchMedStatus = (status: number) => {
    global.fetch = jest.fn(async () => ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => ({ melding: `Feil med status ${status}` }),
    })) as unknown as typeof fetch;
};

beforeEach(() => {
    // Demp forventet console.error fra fetch-laget ved feilrespons.
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
});

const renderModal = () =>
    render(
        <AvsluttMeldekortbehandlingModal
            åpen
            onClose={jest.fn()}
            sakId={'sak_123' as SakId}
            meldekortbehandlingId={'meldekortbehandling_123' as MeldekortbehandlingId}
            redirectUrlEtterSuksess="/sak/12345678"
            saksnummer="12345678"
        />,
    );

const sendInnAvbrytelse = () => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'begrunnelse' } });
    fireEvent.submit(document.querySelector('form')!);
};

describe('AvsluttMeldekortbehandlingModal', () => {
    test('404 (terminal): viser lenke til personoversikten', async () => {
        stubFetchMedStatus(404);
        renderModal();

        sendInnAvbrytelse();

        expect(
            await screen.findByRole('link', { name: 'Gå til personoversikten' }),
        ).toBeInTheDocument();
    });

    test('500 (ukjent serverfeil): ingen lenke, kan prøves på nytt', async () => {
        stubFetchMedStatus(500);
        renderModal();

        sendInnAvbrytelse();

        // Vent til feilen har rukket å propagere.
        expect(await screen.findByText('Det oppstod en feil')).toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: 'Gå til personoversikten' }),
        ).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Avslutt behandling' })).toBeInTheDocument();
    });
});
