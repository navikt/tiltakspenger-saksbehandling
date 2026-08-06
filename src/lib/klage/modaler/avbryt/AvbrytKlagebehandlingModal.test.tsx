/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AvbrytKlagebehandlingModal from './AvbrytKlagebehandlingModal';
import { SakId } from '~/lib/sak/SakTyper';
import { KlageId } from '~/lib/klage/typer/Klage';

// jsdom implementerer ikke <dialog>, som Aksel sin Modal baserer seg på.
// Vi setter open-attributtet slik at innholdet regnes som synlig/tilgjengelig.
beforeAll(() => {
    HTMLDialogElement.prototype.showModal = jest.fn(function (this: HTMLDialogElement) {
        this.open = true;
    });
    HTMLDialogElement.prototype.close = jest.fn(function (this: HTMLDialogElement) {
        this.open = false;
    });
});

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
const svarMedStatus = (status: number, melding: string) => {
    const fetchMock = jest.fn(async () => ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => ({ melding }),
    }));
    global.fetch = fetchMock as unknown as typeof global.fetch;
    return fetchMock;
};

const renderModal = () => {
    const onClose = jest.fn();

    render(
        <AvbrytKlagebehandlingModal
            sakId={'sak_1' as SakId}
            klageId={'klage_1' as KlageId}
            saksnummer={'12345678'}
            åpen
            onClose={onClose}
        />,
    );

    const avbrytBehandling = () => {
        fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'KLAGE_TRUKKET' } });
        fireEvent.submit(document.querySelector('form')!);
    };

    return { onClose, avbrytBehandling };
};

describe('AvbrytKlagebehandlingModal', () => {
    test('sender inn avbrytingen med valgt status', async () => {
        const fetchMock = svarMedStatus(200, 'ok');

        const { avbrytBehandling } = renderModal();

        expect(screen.getByRole('button', { name: 'Avslutt behandling' })).toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: 'Gå til personoversikten' }),
        ).not.toBeInTheDocument();

        avbrytBehandling();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

        const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        expect(url).toBe('/api/sak/sak_1/klage/klage_1/avbryt');
        expect(init.method).toBe('PATCH');
        expect(JSON.parse(init.body as string)).toEqual({
            status: 'KLAGE_TRUKKET',
            begrunnelse: null,
        });
    });

    test('validering hindrer innsending når status ikke er valgt', async () => {
        const fetchMock = svarMedStatus(200, 'ok');

        renderModal();

        fireEvent.submit(document.querySelector('form')!);

        expect(await screen.findByText('Status er påkrevd')).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test.each([404, 409])(
        '%i (terminal): viser lenke til personoversikten og blokkerer nytt forsøk',
        async (status) => {
            const fetchMock = svarMedStatus(status, 'Behandlingen kan ikke avbrytes');

            const { avbrytBehandling } = renderModal();

            avbrytBehandling();

            expect(
                await screen.findByRole('link', { name: 'Gå til personoversikten' }),
            ).toBeInTheDocument();
            expect(
                screen.queryByRole('button', { name: 'Avslutt behandling' }),
            ).not.toBeInTheDocument();

            // Nytt forsøk hjelper ikke på terminale feil, så vi oppfordrer ikke til det.
            expect(screen.queryByText(/prøv igjen om litt/i)).not.toBeInTheDocument();

            fireEvent.submit(document.querySelector('form')!);

            expect(fetchMock).toHaveBeenCalledTimes(1);
        },
    );

    test('500 (ukjent serverfeil): viser feilmeldingen og oppfordrer til nytt forsøk', async () => {
        const fetchMock = svarMedStatus(500, 'Noe gikk galt');

        const { avbrytBehandling } = renderModal();

        avbrytBehandling();

        // Vi viser det backend faktisk sender ...
        expect(await screen.findByText('Noe gikk galt')).toBeInTheDocument();
        // ... men sier likevel fra om at hen kan prøve igjen om litt.
        expect(screen.getByText(/prøv igjen om litt/i)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Avslutt behandling' })).toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: 'Gå til personoversikten' }),
        ).not.toBeInTheDocument();

        avbrytBehandling();

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    });

    test('terminal feil: klikk på "Gå til personoversikten" lukker modalen', async () => {
        svarMedStatus(404, 'Fant ikke behandlingen');

        const { onClose, avbrytBehandling } = renderModal();

        avbrytBehandling();

        fireEvent.click(await screen.findByRole('link', { name: 'Gå til personoversikten' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('feilmeldingen vises i body sammen med info-boksen, ikke i footeren med knappene', async () => {
        svarMedStatus(500, 'Noe gikk galt');

        const { avbrytBehandling } = renderModal();

        avbrytBehandling();

        const feil = await screen.findByText('Noe gikk galt');
        const infoboks = screen.getByText(/Bruker får ikke innsyn/);
        const lukkKnapp = screen.getByRole('button', { name: 'Ikke avslutt behandling' });

        // Feilen skal dele container (body) med info-boksen ...
        const body = feil.closest('.aksel-modal__body');
        expect(body).not.toBeNull();
        expect(body).toContainElement(infoboks);
        // ... og ikke ligge i footeren sammen med handlingsknappene (der den sprengte ut).
        expect(body).not.toContainElement(lukkKnapp);
    });

    test('aria-label på modalen er tittelen (for skjermlesere)', () => {
        renderModal();

        expect(screen.getByRole('dialog', { name: 'Avslutt klagebehandling' })).toBeInTheDocument();
    });
});
