/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import { SakId } from '~/lib/sak/SakTyper';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { MeldekortbehandlingSettPåVent } from './MeldekortbehandlingSettPåVent';

const opprinneligFetch = global.fetch;
const fetchMock = jest.fn<typeof fetch>();

beforeEach(() => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) } as Response);
    global.fetch = fetchMock;
});

afterEach(() => {
    global.fetch = opprinneligFetch;
});

const DialogUtenNavigasjon = () => {
    const [åpen, setÅpen] = useState(true);
    return (
        <>
            <Button onClick={() => setÅpen(true)}>Åpne dialog</Button>
            <MeldekortbehandlingSettPåVent
                sakId={'sak_test' as SakId}
                meldekortId={'meldekort_test' as MeldekortbehandlingId}
                åpen={åpen}
                onClose={() => setÅpen(false)}
                onSuccess={() => setÅpen(false)}
            />
        </>
    );
};

const fyllBegrunnelse = () =>
    fireEvent.change(screen.getByRole('textbox', { name: /Hvorfor settes behandlingen på vent/ }), {
        target: { value: 'Venter på opplysninger' },
    });

const fyllFrist = (value: string) =>
    fireEvent.change(screen.getByRole('textbox', { name: /Når burde behandlingen gjenopptas/ }), {
        target: { value },
    });

const sendInn = () =>
    fireEvent.click(screen.getByRole('button', { name: 'Sett behandling på vent' }));

const forventFrist = (frist: string | null) =>
    expect(fetchMock).toHaveBeenLastCalledWith(
        '/api/sak/sak_test/meldekort/meldekort_test/vent',
        expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify({ begrunnelse: 'Venter på opplysninger', frist }),
        }),
    );

test.each([
    ['32.13.2099', 'Skriv inn en gyldig dato (dd.mm.åååå)'],
    ['01.01.2000', 'Fristen kan ikke være før dagens dato'],
])('stopper frist %s og tillater innsending etter retting', async (frist, feilmelding) => {
    render(<DialogUtenNavigasjon />);
    fyllBegrunnelse();
    fyllFrist(frist);
    sendInn();

    expect(screen.getByText(feilmelding)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    fyllFrist('01.01.2099');
    expect(screen.queryByText(feilmelding)).not.toBeInTheDocument();
    sendInn();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    forventFrist('2099-01-01');
});

test.each(['', '32.13.2099'])('tillater tom frist etter startverdi "%s"', async (frist) => {
    render(<DialogUtenNavigasjon />);
    fyllBegrunnelse();
    if (frist) {
        fyllFrist(frist);
        sendInn();
        expect(fetchMock).not.toHaveBeenCalled();
        fyllFrist('');
    }

    sendInn();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    forventFrist(null);
});

test.each(['01.01.2099', '32.13.2099'])(
    'nullstiller frist og validering etter avbryt med "%s"',
    async (frist) => {
        render(<DialogUtenNavigasjon />);
        fyllFrist(frist);
        sendInn();
        fireEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

        fireEvent.click(screen.getByRole('button', { name: 'Åpne dialog' }));
        expect(screen.queryByText('Du må fylle ut en begrunnelse')).not.toBeInTheDocument();
        expect(screen.queryByText('Skriv inn en gyldig dato (dd.mm.åååå)')).not.toBeInTheDocument();
        fyllBegrunnelse();
        sendInn();
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        forventFrist(null);
    },
);
