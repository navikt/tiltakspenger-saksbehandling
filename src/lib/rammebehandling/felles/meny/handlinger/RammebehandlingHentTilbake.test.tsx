/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SakId, SakProps } from '~/lib/sak/SakTyper';
import { sak } from '~test/rammebehandling';
import { Saksnummer } from '~/lib/sak/Saksnummer';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { RammebehandlingHentTilbake } from './RammebehandlingHentTilbake';

const opprinneligFetch = global.fetch;
const fetchMock = jest.fn<typeof fetch>();

beforeEach(() => {
    global.fetch = fetchMock;
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    global.fetch = opprinneligFetch;
    fetchMock.mockReset();
    jest.restoreAllMocks();
});

const svar = (status: number, body: unknown) =>
    ({ ok: status < 400, status, json: async () => body }) as Response;

const renderDialog = () => {
    const onSuccess = jest.fn<(sak: SakProps) => void>();
    render(
        <RammebehandlingHentTilbake
            sakId={'sak_test' as SakId}
            saksnummer={'202501011001' as Saksnummer}
            behandlingId={'beh_test' as RammebehandlingId}
            åpen={true}
            onClose={() => {}}
            onSuccess={onSuccess}
        />,
    );
    return onSuccess;
};

const hentTilbakeKnapp = () =>
    screen.queryByRole('button', { name: 'Hent tilbake som saksbehandler' });

const klikkHentTilbake = () =>
    fireEvent.click(screen.getByRole('button', { name: 'Hent tilbake som saksbehandler' }));

describe('RammebehandlingHentTilbake', () => {
    test('venter på bekreftelse, sender POST til henttilbake og gir oppdatert sak til onSuccess', async () => {
        const oppdatertSak = sak();
        fetchMock.mockResolvedValue(svar(200, oppdatertSak));
        const onSuccess = renderDialog();

        expect(
            screen.getByRole('dialog', { name: 'Hent tilbake behandlingen som saksbehandler?' }),
        ).toBeInTheDocument();
        expect(screen.getByText(/Det automatiske resultatet nullstilles/)).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();

        klikkHentTilbake();

        await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(oppdatertSak));
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/sak/sak_test/behandling/beh_test/henttilbake',
            expect.objectContaining({ method: 'POST' }),
        );
    });

    test('lar saksbehandler prøve igjen ved feil som ikke er terminal', async () => {
        fetchMock.mockResolvedValue(svar(500, { melding: 'Noe gikk galt', kode: 'ukjent' }));
        const onSuccess = renderDialog();

        klikkHentTilbake();

        expect(await screen.findByText(/kode 500/)).toBeInTheDocument();
        expect(hentTilbakeKnapp()).toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: 'Gå til personoversikten' }),
        ).not.toBeInTheDocument();
        expect(onSuccess).not.toHaveBeenCalled();
    });

    test.each([404, 409])(
        '%i (terminal): skjuler knappen for å hente tilbake og viser lenke til personoversikten',
        async (status) => {
            fetchMock.mockResolvedValue(svar(status, { melding: 'Feil', kode: 'feil' }));
            const onSuccess = renderDialog();

            klikkHentTilbake();

            const lenke = await screen.findByRole('link', { name: 'Gå til personoversikten' });
            expect(lenke).toHaveAttribute('href', expect.stringContaining('202501011001'));
            expect(hentTilbakeKnapp()).not.toBeInTheDocument();
            expect(onSuccess).not.toHaveBeenCalled();
        },
    );
});
