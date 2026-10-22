/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { Saksnummer } from '~/lib/sak/Saksnummer';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { BenkBehandlingstype, BenkTilgangsvurdering } from '../../typer/felles';
import { BenkTab } from '../../typer/tabs';
import { BenkTabData } from '../../typer/benkside';
import {
    BenkTilbakekreving,
    BenkTilbakekrevingKilde,
    BenkTilbakekrevingStatus,
} from '../../typer/tilbakekreving';
import { BenkVisningProvider, useBenkVisning } from '../filter/BenkVisningContext';
import { BenkTildelCheckbox } from './BenkTildelCheckbox';
import { BenkTildelFlere } from './BenkTildelFlere';

const router = {
    query: { tab: BenkTab.TILBAKEKREVING },
    pathname: '/',
    asPath: `/?tab=${BenkTab.TILBAKEKREVING}`,
    push: jest.fn(async () => true),
    prefetch: jest.fn(async () => undefined),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
} as unknown as NextRouter;

const tabData = {
    tab: BenkTab.TILBAKEKREVING,
    data: {
        aktivtFilter: { kunTildeltMeg: false, skjulPåVent: false, skjulEgneTilBeslutning: false },
    },
} as unknown as BenkTabData;

const tilbakekreving: BenkTilbakekreving = {
    type: BenkBehandlingstype.TILBAKEKREVING,
    id: 'tilbakekreving_1' as BenkTilbakekreving['id'],
    sakId: ikkeSladdet('sak_1' as const),
    fnr: ikkeSladdet('12345678910'),
    saksnummer: ikkeSladdet('202501011001' as Saksnummer),
    startet: '2025-01-01T12:00:00',
    sistEndret: '2025-01-02T12:00:00',
    saksbehandler: null,
    beslutter: null,
    erUnderkjent: false,
    ventestatus: {
        erSattPåVent: false,
        begrunnelse: ikkeSladdet(null),
        frist: null,
        venterTil: null,
    },
    tilgang: { vurdering: BenkTilgangsvurdering.HAR_TILGANG, grunn: null },
    personmarkører: { skjermet: false, kode6: false, kode7: false },
    status: BenkTilbakekrevingStatus.TIL_BEHANDLING,
    beløp: 1000,
    kilde: BenkTilbakekrevingKilde.MELDEKORT,
    kravgrunnlagPeriode: { fraOgMed: '2025-01-01', tilOgMed: '2025-01-31' },
    url: 'https://tilbakekreving.nav.no/behandling/1',
    gyldigeKommandoer: [SaksbehandlerBehandlingKommando.TildelSaksbehandler],
};

// Aksel sin ActionMenu er svært treg i jsdom, så tildelingstypen velges direkte i konteksten
const VelgSaksbehandlertildeling = () => {
    const { setValgtTildelingType } = useBenkVisning();
    return <button onClick={() => setValgtTildelingType('saksbehandler')}>Velg</button>;
};

const opprinneligFetch = global.fetch;
const fetchMock = jest.fn<typeof fetch>();

beforeEach(() => {
    fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
            tilbakekrevinger: [{ tilbakekrevingId: tilbakekreving.id, saksnummer: '202501011001' }],
        }),
    } as Response);
    global.fetch = fetchMock;
});

afterEach(() => {
    global.fetch = opprinneligFetch;
});

describe('BenkTildelFlere', () => {
    test('tildeler valgte tilbakekrevinger via tilbakekrevingsendepunktet', async () => {
        render(
            <RouterContext.Provider value={router}>
                <BenkVisningProvider tabData={tabData}>
                    <VelgSaksbehandlertildeling />
                    <BenkTildelFlere behandlinger={[tilbakekreving]} />
                    <BenkTildelCheckbox behandling={tilbakekreving} />
                </BenkVisningProvider>
            </RouterContext.Provider>,
        );

        fireEvent.click(screen.getByText('Velg'));
        fireEvent.click(screen.getByRole('checkbox', { name: 'Tildel' }));
        fireEvent.click(screen.getByRole('button', { name: 'Tildel' }));

        expect(await screen.findByText('Tildel meg 1 behandlinger')).toBeInTheDocument();
        expect(screen.getByText('/sak/202501011001#Tilbakekreving')).toBeInTheDocument();

        const [, bekreft] = screen.getAllByRole('button', { name: 'Tildel', hidden: true });
        fireEvent.click(bekreft);

        await waitFor(() => expect(router.push).toHaveBeenCalled());
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            '/api/tilbakekreving/tildel',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    tilbakekrevinger: [{ tilbakekrevingId: 'tilbakekreving_1', sakId: 'sak_1' }],
                }),
            }),
        );
    });
});
