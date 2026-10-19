/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
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

const DialogUtenNavigasjon = ({ oppdater = false }: { oppdater?: boolean }) => {
    const [åpen, setÅpen] = useState(true);
    return (
        <>
            <Button onClick={() => setÅpen(true)}>Åpne dialog</Button>
            <MeldekortbehandlingSettPåVent
                sakId={'sak_test' as SakId}
                meldekortId={'meldekort_test' as MeldekortbehandlingId}
                oppdaterSattPåVent={oppdater}
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

const sendInn = (oppdater = false) =>
    fireEvent.click(
        screen.getByRole('button', {
            name: oppdater ? 'Endre ventestatus' : 'Sett behandling på vent',
        }),
    );

const forventFrist = (frist: string | null, oppdater = false) =>
    expect(fetchMock).toHaveBeenLastCalledWith(
        '/api/sak/sak_test/meldekort/meldekort_test/vent',
        expect.objectContaining({
            method: 'PATCH',
            body: JSON.stringify({
                begrunnelse: 'Venter på opplysninger',
                frist,
                oppdaterSattPåVent: oppdater,
            }),
        }),
    );

const fristFjernesTekst =
    'Har behandlingen en frist fra før, blir den fjernet hvis du ikke velger ny.';

describe.each([
    {
        oppdater: false,
        tittel: 'Sett meldekortbehandlingen på vent?',
        feilTittel: 'Feil ved å sette på vent',
    },
    {
        oppdater: true,
        tittel: 'Endre ventestatus',
        feilTittel: 'Feil ved å endre ventestatus',
    },
])('oppdaterSattPåVent=$oppdater', ({ oppdater, tittel, feilTittel }) => {
    test('viser riktige tekster', () => {
        render(<DialogUtenNavigasjon oppdater={oppdater} />);

        expect(screen.getByText(tittel, { selector: 'strong' })).toBeInTheDocument();
        if (oppdater) {
            expect(screen.getByText(fristFjernesTekst)).toBeInTheDocument();
        } else {
            expect(screen.queryByText(fristFjernesTekst)).not.toBeInTheDocument();
        }
    });

    test.each([
        ['01.01.2099', '2099-01-01'],
        ['', null],
    ])('sender flagget med frist "%s"', async (fristInput, forventetFrist) => {
        render(<DialogUtenNavigasjon oppdater={oppdater} />);
        fyllBegrunnelse();
        if (fristInput) {
            fyllFrist(fristInput);
        }
        sendInn(oppdater);

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        forventFrist(forventetFrist, oppdater);
    });

    test('viser feilkort når kallet feiler', async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => {
                throw new Error('ikke json');
            },
        } as unknown as Response);
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        try {
            render(<DialogUtenNavigasjon oppdater={oppdater} />);
            fyllBegrunnelse();
            sendInn(oppdater);

            expect(await screen.findByText(feilTittel)).toBeInTheDocument();
            expect(consoleError).toHaveBeenCalledTimes(1);
        } finally {
            consoleError.mockRestore();
        }
    });
});

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
