/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SakId } from '~/lib/sak/SakTyper';
import { KlageId } from '~/lib/klage/typer/Klage';
import SendForvaltningsmeldingSkjema from './SendForvaltningsmeldingSkjema';

const opprinneligFetch = global.fetch;
const opprinneligConsoleError = console.error;

beforeEach(() => {
    // Fetch-feil logges av fetch-laget, og støyer i testutskriften.
    console.error = jest.fn();
});

afterEach(() => {
    global.fetch = opprinneligFetch;
    console.error = opprinneligConsoleError;
});

// jsdom-miljøet har ikke Response, så vi returnerer et minimalt svar-objekt.
const svarMed = (status: number, body: unknown) => {
    const fetchMock = jest.fn(async () => ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
        blob: async () => new Blob(['%PDF'], { type: 'application/pdf' }),
    }));
    global.fetch = fetchMock as unknown as typeof global.fetch;
    return fetchMock;
};

const renderSkjema = () => {
    const onSendt = jest.fn();
    render(
        <SendForvaltningsmeldingSkjema
            sakId={'sak_1' as SakId}
            klageId={'klage_1' as KlageId}
            innsendingsdato={'2025-04-01'}
            onSendt={onSendt}
        />,
    );
    return { onSendt };
};

const erstattPlassholdere = () =>
    screen.getAllByRole('textbox', { name: /^Avsnitt/ }).forEach((felt) =>
        fireEvent.change(felt, {
            target: { value: (felt as HTMLTextAreaElement).value.replaceAll(' X ', ' 4 ') },
        }),
    );

const klikkSend = () =>
    fireEvent.click(screen.getByRole('button', { name: 'Send forvaltningsmelding' }));

describe('SendForvaltningsmeldingSkjema', () => {
    test('er forhåndsutfylt med standardteksten', () => {
        renderSkjema();

        expect(screen.getByRole('form', { name: 'Send forvaltningsmelding' })).toBeInTheDocument();
        expect(screen.getByDisplayValue('Svartid')).toBeInTheDocument();
        expect(
            screen.getByDisplayValue('Begrunnelse for saksbehandlingstiden vår'),
        ).toBeInTheDocument();
        expect(screen.queryByDisplayValue('Du må melde fra om endringer')).not.toBeInTheDocument();
    });

    test('krever bekreftelse før forvaltningsmeldingen sendes', async () => {
        const fetchMock = svarMed(200, { id: 'klage_1' });
        const { onSendt } = renderSkjema();

        erstattPlassholdere();
        klikkSend();

        expect(await screen.findByText(/Det kan bare sendes én/)).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();

        fireEvent.click(
            screen.getByRole('button', { name: 'Ja, send forvaltningsmelding til bruker' }),
        );

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        expect(url).toBe('/api/sak/sak_1/klage/klage_1/forvaltningsmelding');
        expect(init.method).toBe('POST');
        const body = JSON.parse(init.body as string);
        expect(body.tekster.map((t: { tittel: string }) => t.tittel)).toEqual([
            'Svartid',
            'Begrunnelse for saksbehandlingstiden vår',
        ]);
        await waitFor(() => expect(onSendt).toHaveBeenCalledWith({ id: 'klage_1' }));
    });

    test('validering hindrer sending når et avsnitt er tomt', async () => {
        const fetchMock = svarMed(200, {});
        renderSkjema();

        fireEvent.change(screen.getByDisplayValue('Svartid'), { target: { value: '' } });
        klikkSend();

        expect(await screen.findByText('Tittelen kan ikke være tom')).toBeInTheDocument();
        expect(screen.queryByText(/Det kan bare sendes én/)).not.toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test('validering hindrer sending når plassholderen X ikke er byttet ut', async () => {
        const fetchMock = svarMed(200, {});
        renderSkjema();

        klikkSend();

        expect(await screen.findAllByText('Bytt ut X med antall måneder eller uker')).toHaveLength(
            2,
        );
        expect(screen.queryByText(/Det kan bare sendes én/)).not.toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    const sendOgBekreft = async () => {
        erstattPlassholdere();
        klikkSend();
        fireEvent.click(
            await screen.findByRole('button', { name: 'Ja, send forvaltningsmelding til bruker' }),
        );
    };

    test('allerede sendt er terminal og hindrer nytt forsøk', async () => {
        const fetchMock = svarMed(400, {
            kode: 'forvaltningsmelding_allerede_sendt',
            melding: 'Allerede sendt',
        });
        const { onSendt } = renderSkjema();

        await sendOgBekreft();

        expect(
            await screen.findByText(
                'Det er allerede sendt en forvaltningsmelding for denne klagebehandlingen',
            ),
        ).toBeInTheDocument();
        expect(onSendt).not.toHaveBeenCalled();
        expect(screen.queryByRole('button', { name: /send forvaltningsmelding/i })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Tilbake til redigering' })).toBeNull();
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test.each([404, 409])('status %i er terminal og hindrer nytt forsøk', async (status) => {
        svarMed(status, { kode: 'ukjent', melding: 'Feil' });
        renderSkjema();

        await sendOgBekreft();

        expect(await screen.findByText(/Last inn siden på nytt/)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /send forvaltningsmelding/i })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Tilbake til redigering' })).toBeNull();
    });

    test('andre feil kan prøves på nytt', async () => {
        svarMed(500, { kode: 'ukjent', melding: 'Feil' });
        renderSkjema();

        await sendOgBekreft();

        expect(await screen.findByText(/Prøv igjen om litt/)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Ja, send forvaltningsmelding til bruker' }),
        ).toBeInTheDocument();
    });

    test('forhåndsvisning sender tekstene til forhåndsvis-endepunktet og åpner PDF-en', async () => {
        const fetchMock = svarMed(200, {});
        const opprinneligCreateObjectURL = URL.createObjectURL;
        const opprinneligOpen = window.open;
        URL.createObjectURL = jest.fn(() => 'blob:forhandsvisning');
        const openMock = jest.fn();
        window.open = openMock as unknown as typeof window.open;

        try {
            renderSkjema();

            fireEvent.click(screen.getByRole('button', { name: 'Forhåndsvis' }));

            await waitFor(() => expect(openMock).toHaveBeenCalledWith('blob:forhandsvisning'));
            const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
            expect(url).toBe('/api/sak/sak_1/klage/klage_1/forvaltningsmelding/forhandsvis');
            expect(JSON.parse(init.body as string).tekster).toHaveLength(2);
            expect(
                screen.queryByText('Feil ved forhåndsvisning av forvaltningsmelding'),
            ).not.toBeInTheDocument();
        } finally {
            URL.createObjectURL = opprinneligCreateObjectURL;
            window.open = opprinneligOpen;
        }
    });
});
