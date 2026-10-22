/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BehandlingsmenyDialog } from '~/lib/behandling-felles/meny/BehandlingsmenyValg';
import { SaksbehandlerBehandlingKommando as Kommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { TilbakekrevingId } from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { TilbakekrevingDialoger } from './TilbakekrevingDialoger';

const opprinneligFetch = global.fetch;
const fetchMock = jest.fn<typeof fetch>();
const oppdatertSak = { saksnummer: '202601011001' } as unknown as SakProps;

beforeEach(() => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => oppdatertSak } as Response);
    global.fetch = fetchMock;
});

afterEach(() => {
    global.fetch = opprinneligFetch;
});

const renderDialoger = (gyldigeKommandoer: Kommando[], aktivDialog: BehandlingsmenyDialog) => {
    const onSuccess =
        jest.fn<(utfall: 'tildelt' | 'lagtTilbake', melding: string, sak: SakProps) => void>();

    render(
        <TilbakekrevingDialoger
            tilbakekrevingId={'tilbakekreving_test' as TilbakekrevingId}
            sakId={'sak_test' as SakId}
            gyldigeKommandoer={gyldigeKommandoer}
            overtarFra={'Z111111'}
            aktivDialog={aktivDialog}
            onClose={() => {}}
            onSuccessTildelt={(melding) => (sak) => onSuccess('tildelt', melding, sak)}
            onSuccessLagtTilbake={(melding) => (sak) => onSuccess('lagtTilbake', melding, sak)}
        />,
    );

    return onSuccess;
};

const forventKall = (handling: string) =>
    expect(fetchMock).toHaveBeenCalledWith(
        `/api/sak/sak_test/tilbakekreving/tilbakekreving_test/${handling}`,
        expect.objectContaining({ method: 'POST' }),
    );

describe('TilbakekrevingDialoger', () => {
    test.each([
        {
            kommando: Kommando.TildelSaksbehandler,
            dialog: 'tildelMeg',
            handling: 'tildel',
            melding: 'Tilbakekrevingen er tildelt deg',
            utfall: 'tildelt',
        },
        {
            kommando: Kommando.TildelBeslutter,
            dialog: 'tildelMeg',
            handling: 'tildel',
            melding: 'Tilbakekrevingen er tildelt deg',
            utfall: 'tildelt',
        },
        {
            kommando: Kommando.LeggTilbakeSaksbehandler,
            dialog: 'leggTilbake',
            handling: 'legg-tilbake',
            melding: 'Tilbakekrevingen er lagt tilbake',
            utfall: 'lagtTilbake',
        },
        {
            kommando: Kommando.LeggTilbakeBeslutter,
            dialog: 'leggTilbake',
            handling: 'legg-tilbake',
            melding: 'Tilbakekrevingen er lagt tilbake',
            utfall: 'lagtTilbake',
        },
    ] as const)(
        '$kommando utføres umiddelbart mot $handling',
        async ({ kommando, dialog, handling, melding, utfall }) => {
            const onSuccess = renderDialoger([kommando], dialog);

            await waitFor(() =>
                expect(onSuccess).toHaveBeenCalledWith(utfall, melding, oppdatertSak),
            );
            forventKall(handling);
        },
    );

    test.each([Kommando.OvertaSaksbehandler, Kommando.OvertaBeslutter])(
        '%s krever bekreftelse før tilbakekrevingen overtas',
        async (kommando) => {
            const onSuccess = renderDialoger([kommando], 'overta');

            expect(
                screen.getByText('Er du sikker på at du vil ta over tilbakekrevingen fra Z111111?'),
            ).toBeInTheDocument();
            expect(fetchMock).not.toHaveBeenCalled();

            fireEvent.click(screen.getByRole('button', { name: 'Overta behandling' }));

            await waitFor(() =>
                expect(onSuccess).toHaveBeenCalledWith(
                    'tildelt',
                    'Du har overtatt tilbakekrevingen',
                    oppdatertSak,
                ),
            );
            forventKall('overta');
        },
    );

    test('monterer ikke dialoger for handlinger som ikke er gyldige', () => {
        renderDialoger([Kommando.TildelSaksbehandler], 'overta');

        expect(screen.queryByText('Overta tilbakekrevingen?')).not.toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
