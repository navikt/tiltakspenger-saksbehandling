/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ActionMenu } from '@navikt/ds-react';
import { ÅpenRammebehandlingForOversikt } from '~/lib/personoversikt/typer/ÅpenBehandlingForOversikt';
import LeggTilbakeBehandlingMenyvalg from './LeggTilbakeBehandlingMenyvalg';

// jsdom implementerer ikke ResizeObserver, som Aksel sin ActionMenu (Radix) baserer seg på.
beforeAll(() => {
    global.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

const originalFetch = global.fetch;

// Stubber nettverkslaget slik at legg tilbake-kallet svarer med gitt HTTP-status.
const stubFetchMedStatus = (status: number) => {
    global.fetch = jest.fn(async () => ({
        ok: status >= 200 && status < 300,
        status,
        json: async () =>
            status >= 200 && status < 300
                ? {}
                : { melding: `Feil med status ${status}`, kode: 'ugyldig_status_for_legg_tilbake' },
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

const behandling = {
    sakId: 'sak_123',
    id: 'beh_123',
    saksnummer: '12345678',
} as unknown as ÅpenRammebehandlingForOversikt;

const renderMenyvalg = ({
    onSuccess = jest.fn(),
    onError = jest.fn(),
}: {
    onSuccess?: (oppdatertSak: unknown) => void;
    onError?: (error: unknown) => void;
}) =>
    render(
        <ActionMenu open>
            <ActionMenu.Trigger>
                <button>Velg</button>
            </ActionMenu.Trigger>
            <ActionMenu.Content>
                <LeggTilbakeBehandlingMenyvalg
                    behandling={behandling}
                    onSuccess={onSuccess}
                    onError={onError}
                />
            </ActionMenu.Content>
        </ActionMenu>,
    );

const klikkLeggTilbake = () => {
    fireEvent.click(screen.getByRole('menuitem', { name: 'Legg tilbake' }));
};

describe('LeggTilbakeBehandlingMenyvalg', () => {
    test('suksess: melder fra via onSuccess med oppdatert sak', async () => {
        stubFetchMedStatus(200);
        const onSuccess = jest.fn();
        const onError = jest.fn();
        renderMenyvalg({ onSuccess, onError });

        klikkLeggTilbake();

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(onError).not.toHaveBeenCalled();
    });

    test('feil fra backend: melder fra via onError og ikke onSuccess', async () => {
        stubFetchMedStatus(400);
        const onSuccess = jest.fn();
        const onError = jest.fn();
        renderMenyvalg({ onSuccess, onError });

        klikkLeggTilbake();

        await waitFor(() => expect(onError).toHaveBeenCalled());
        expect(onSuccess).not.toHaveBeenCalled();
    });
});
