/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import { SakId } from '~/lib/sak/SakTyper';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import { RammebehandlingSettPåVent } from './RammebehandlingSettPåVent';

const opprinneligFetch = global.fetch;
const fetchMock = jest.fn<typeof fetch>();

beforeEach(() => {
    fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({}),
    } as Response);
    global.fetch = fetchMock;
});

afterEach(() => {
    global.fetch = opprinneligFetch;
});

const DialogUtenNavigasjon = ({ oppdater = true }: { oppdater?: boolean }) => {
    const [åpen, setÅpen] = useState(true);

    return (
        <>
            <Button onClick={() => setÅpen(true)}>Åpne dialog</Button>
            <RammebehandlingSettPåVent
                sakId={'sak_test' as SakId}
                behandlingId={'beh_test' as RammebehandlingId}
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

const sendInn = (oppdater = true) =>
    fireEvent.click(
        screen.getByRole('button', {
            name: oppdater ? 'Endre ventestatus' : 'Sett behandling på vent',
        }),
    );

const ventTilLukket = () =>
    waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

const forventInnsending = (nummer: number, frist: string | null, oppdater = true) => {
    expect(fetchMock).toHaveBeenNthCalledWith(
        nummer,
        '/api/sak/sak_test/behandling/beh_test/pause',
        expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
                begrunnelse: 'Venter på opplysninger',
                frist,
                oppdaterSattPåVent: oppdater,
            }),
        }),
    );
};

describe('RammebehandlingSettPåVent', () => {
    test('nullstiller fristen etter innsending uten navigasjon', async () => {
        render(<DialogUtenNavigasjon />);
        fyllBegrunnelse();
        fyllFrist('01.01.2099');
        sendInn();
        await ventTilLukket();
        forventInnsending(1, '2099-01-01');

        fireEvent.click(screen.getByRole('button', { name: 'Åpne dialog' }));
        expect(
            screen.getByRole('textbox', { name: /Når burde behandlingen gjenopptas/ }),
        ).toHaveValue('');
        fyllBegrunnelse();
        sendInn();
        await ventTilLukket();
        forventInnsending(2, null);
    });

    test('nullstiller fristen ved avbryt', async () => {
        render(<DialogUtenNavigasjon />);
        fyllFrist('01.01.2099');
        fireEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
        await ventTilLukket();

        fireEvent.click(screen.getByRole('button', { name: 'Åpne dialog' }));
        fyllBegrunnelse();
        sendInn();
        await ventTilLukket();
        forventInnsending(1, null);
    });

    describe.each([true, false])('oppdaterSattPåVent=%s', (oppdater) => {
        test.each([
            ['32.13.2099', 'Skriv inn en gyldig dato (dd.mm.åååå)'],
            ['01.01.2000', 'Fristen kan ikke være før dagens dato'],
        ])('stopper innsending med frist %s til datoen er rettet', async (frist, feilmelding) => {
            render(<DialogUtenNavigasjon oppdater={oppdater} />);
            fyllBegrunnelse();
            fyllFrist(frist);
            sendInn(oppdater);

            expect(screen.getByText(feilmelding)).toBeInTheDocument();
            expect(fetchMock).not.toHaveBeenCalled();

            fyllFrist('01.01.2099');
            expect(screen.queryByText(feilmelding)).not.toBeInTheDocument();
            sendInn(oppdater);
            await ventTilLukket();
            forventInnsending(1, '2099-01-01', oppdater);
        });

        test('tillater tom frist', async () => {
            render(<DialogUtenNavigasjon oppdater={oppdater} />);
            fyllBegrunnelse();
            sendInn(oppdater);
            await ventTilLukket();
            forventInnsending(1, null, oppdater);
        });
    });

    test('tillater å fjerne en ugyldig frist', async () => {
        render(<DialogUtenNavigasjon />);
        fyllBegrunnelse();
        fyllFrist('32.13.2099');
        sendInn();
        expect(fetchMock).not.toHaveBeenCalled();

        fyllFrist('');
        expect(screen.queryByText('Skriv inn en gyldig dato (dd.mm.åååå)')).not.toBeInTheDocument();
        sendInn();
        await ventTilLukket();
        forventInnsending(1, null);
    });

    test('nullstiller valideringsfeil ved lukking', async () => {
        render(<DialogUtenNavigasjon />);
        fyllFrist('32.13.2099');
        sendInn();
        expect(screen.getByText('Du må fylle ut en begrunnelse')).toBeInTheDocument();
        expect(screen.getByText('Skriv inn en gyldig dato (dd.mm.åååå)')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
        await ventTilLukket();
        fireEvent.click(screen.getByRole('button', { name: 'Åpne dialog' }));

        expect(screen.queryByText('Du må fylle ut en begrunnelse')).not.toBeInTheDocument();
        expect(screen.queryByText('Skriv inn en gyldig dato (dd.mm.åååå)')).not.toBeInTheDocument();
        fyllBegrunnelse();
        sendInn();
        await ventTilLukket();
        forventInnsending(1, null);
    });
});
