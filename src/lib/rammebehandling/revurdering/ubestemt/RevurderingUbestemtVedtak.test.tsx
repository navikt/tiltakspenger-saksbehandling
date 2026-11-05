/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    AppRouterContext,
    AppRouterInstance,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { FeatureTogglesProvider } from '~/lib/_felles/context/FeatureTogglesContext';
import { NotificationProvider } from '~/lib/_felles/notifications/NotificationContext';
import { SakProvider } from '~/lib/sak/SakContext';
import { BehandlingProvider } from '~/lib/rammebehandling/context/BehandlingContext';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import {
    Rammebehandlingsstatus,
    Rammebehandling,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { revurderingStans, revurderingUbestemt, sak } from '~test/rammebehandling';
import { nonNullish } from '~/utils/object';
import { RevurderingUbestemtVedtak } from './RevurderingUbestemtVedtak';

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

const renderVedtak = (
    behandling: Rammebehandling,
    deployEnv: NodeJS.ProcessEnv['NAIS_CLUSTER_NAME'] = 'dev-gcp',
) => {
    const router = { push: jest.fn() } as unknown as AppRouterInstance;
    render(
        <AppRouterContext.Provider value={router}>
            <FeatureTogglesProvider deployEnv={deployEnv}>
                <NotificationProvider>
                    <SakProvider sak={sak({ rammebehandlinger: [behandling] })}>
                        <BehandlingProvider behandlingId={behandling.id} klagebehandling={null}>
                            <RevurderingUbestemtVedtak />
                        </BehandlingProvider>
                    </SakProvider>
                </NotificationProvider>
            </FeatureTogglesProvider>
        </AppRouterContext.Provider>,
    );
    return router;
};

const tildelt = revurderingUbestemt({
    status: Rammebehandlingsstatus.UNDER_BEHANDLING,
    gyldigeKommandoer: [
        SaksbehandlerBehandlingKommando.Saksbehandle,
        SaksbehandlerBehandlingKommando.KonverterRevurdering,
        SaksbehandlerBehandlingKommando.Avbryt,
    ],
});

describe('RevurderingUbestemtVedtak', () => {
    test('viser grunnen og valgene for type og avslutning når revurderingen er tildelt', () => {
        renderVedtak(tildelt);

        expect(screen.getByText('Deltakelsen er avbrutt')).toBeInTheDocument();
        ['Stans', 'Innvilgelse', 'Forlengelse', 'Omgjøring', 'Avslutt'].forEach((navn) =>
            expect(screen.getByRole('button', { name: navn })).toBeInTheDocument(),
        );
        expect(screen.queryByText(/må tildeles deg/)).not.toBeInTheDocument();
    });

    test('viser valgene som deaktivert og ber om tildeling når revurderingen ikke kan konverteres', () => {
        renderVedtak(revurderingUbestemt({ gyldigeKommandoer: [] }));

        expect(screen.getByText(/må tildeles deg/)).toBeInTheDocument();
        ['Stans', 'Innvilgelse', 'Forlengelse', 'Omgjøring', 'Avslutt'].forEach((navn) =>
            expect(screen.getByRole('button', { name: navn })).toBeDisabled(),
        );
    });

    test('viser ikke forlengelse i prod', () => {
        renderVedtak(tildelt, 'prod-gcp');

        expect(screen.getByRole('button', { name: 'Stans' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Forlengelse' })).not.toBeInTheDocument();
    });

    test('viser ingen valg når revurderingen er avsluttet', () => {
        renderVedtak(revurderingUbestemt({ status: Rammebehandlingsstatus.AVBRUTT }));

        expect(screen.queryByText('Hva skal skje med revurderingen?')).not.toBeInTheDocument();
    });

    test('konverterer revurderingen via dialogen og oppdaterer saken', async () => {
        const konvertert = revurderingStans({ id: tildelt.id });
        fetchMock.mockResolvedValue(svar(200, sak({ rammebehandlinger: [konvertert] })));
        renderVedtak(tildelt);

        fireEvent.click(screen.getByRole('button', { name: 'Stans' }));
        fireEvent.click(screen.getByRole('button', { name: 'Endre til stans' }));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(fetchMock).toHaveBeenCalledWith(
            `/api/sak/sak_1/behandling/${tildelt.id}/konverter`,
            expect.objectContaining({ method: 'POST' }),
        );
        expect(JSON.parse(nonNullish(fetchMock.mock.calls[0][1]).body as string)).toEqual({
            revurderingType: 'STANS',
            rammevedtakIdSomForlenges: null,
        });
    });

    test('avslutter revurderingen med begrunnelse og går til personoversikten', async () => {
        fetchMock.mockResolvedValue(svar(200, sak()));
        const router = renderVedtak(tildelt);

        fireEvent.click(screen.getByRole('button', { name: 'Avslutt' }));
        fireEvent.change(screen.getByRole('textbox'), {
            target: { value: 'Endringen krever ingen ny vurdering' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Avslutt behandling' }));

        await waitFor(() => expect(router.push).toHaveBeenCalled());
        expect(JSON.parse(nonNullish(fetchMock.mock.calls[0][1]).body as string)).toEqual({
            begrunnelse: 'Endringen krever ingen ny vurdering',
            behandlingId: tildelt.id,
        });
    });
});
