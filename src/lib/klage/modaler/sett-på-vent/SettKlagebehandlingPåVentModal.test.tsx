/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import { FetcherError } from '~/utils/fetch/fetch';
import { Nullable } from '~/types/UtilTypes';
import SettKlagebehandlingPåVentModal from './SettKlagebehandlingPåVentModal';

const DialogUtenNavigasjon = ({
    onSubmit,
    oppdater = false,
    error = null,
}: {
    onSubmit: (begrunnelse: string, frist: string | null) => void;
    oppdater?: boolean;
    error?: Nullable<FetcherError>;
}) => {
    const [åpen, setÅpen] = useState(true);
    return (
        <>
            <Button onClick={() => setÅpen(true)}>Åpne dialog</Button>
            <SettKlagebehandlingPåVentModal
                åpen={åpen}
                onClose={() => setÅpen(false)}
                oppdaterSattPåVent={oppdater}
                api={{
                    trigger: (begrunnelse, frist) => {
                        onSubmit(begrunnelse, frist);
                        setÅpen(false);
                    },
                    isMutating: false,
                    error,
                }}
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

const fristFjernesTekst =
    'Har behandlingen en frist fra før, blir den fjernet hvis du ikke velger ny.';

describe.each([
    {
        oppdater: false,
        tittel: 'Sett behandling på vent',
        feilTittel: 'Kunne ikke sette behandling på vent',
    },
    {
        oppdater: true,
        tittel: 'Endre ventestatus',
        feilTittel: 'Kunne ikke endre ventestatus',
    },
])('oppdaterSattPåVent=$oppdater', ({ oppdater, tittel, feilTittel }) => {
    test('viser riktig tittel og hjelpetekst for fristen', () => {
        render(<DialogUtenNavigasjon onSubmit={jest.fn()} oppdater={oppdater} />);

        expect(screen.getByRole('dialog', { name: tittel })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: tittel })).toBeInTheDocument();
        if (oppdater) {
            expect(screen.getByText(fristFjernesTekst)).toBeInTheDocument();
        } else {
            expect(screen.queryByText(fristFjernesTekst)).not.toBeInTheDocument();
        }
    });

    test.each([
        ['01.01.2099', '2099-01-01'],
        ['', ''],
    ])('sender begrunnelse og frist "%s"', async (fristInput, forventetFrist) => {
        const onSubmit = jest.fn();
        render(<DialogUtenNavigasjon onSubmit={onSubmit} oppdater={oppdater} />);
        fyllBegrunnelse();
        if (fristInput) {
            fyllFrist(fristInput);
        }
        sendInn(oppdater);

        await waitFor(() =>
            expect(onSubmit).toHaveBeenCalledWith('Venter på opplysninger', forventetFrist),
        );
    });

    test('viser feilmelding fra API-et under riktig tittel', () => {
        const error = new FetcherError({
            status: 400,
            message: 'Behandlingen må være satt på vent for å kunne oppdateres.',
        });
        render(<DialogUtenNavigasjon onSubmit={jest.fn()} oppdater={oppdater} error={error} />);

        expect(screen.getByText(feilTittel)).toBeInTheDocument();
        expect(screen.getByText(error.message)).toBeInTheDocument();
    });
});

test.each([
    ['32.13.2099', 'Skriv inn en gyldig dato (dd.mm.åååå)'],
    ['01.01.2000', 'Fristen kan ikke være før dagens dato'],
])('stopper frist %s og sender ISO-dato etter retting', async (frist, feilmelding) => {
    const onSubmit = jest.fn();
    render(<DialogUtenNavigasjon onSubmit={onSubmit} />);
    fyllBegrunnelse();
    fyllFrist(frist);
    sendInn();

    expect(await screen.findByText(feilmelding)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    sendInn();
    await waitFor(() => expect(screen.getByText(feilmelding)).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();

    fyllFrist('01.01.2099');
    await waitFor(() => expect(screen.queryByText(feilmelding)).not.toBeInTheDocument());
    sendInn();
    await waitFor(() =>
        expect(onSubmit).toHaveBeenCalledWith('Venter på opplysninger', '2099-01-01'),
    );
});

test.each(['', '32.13.2099'])('tillater tom frist etter startverdi "%s"', async (frist) => {
    const onSubmit = jest.fn();
    render(<DialogUtenNavigasjon onSubmit={onSubmit} />);
    fyllBegrunnelse();
    if (frist) {
        fyllFrist(frist);
        sendInn();
        await screen.findByText('Skriv inn en gyldig dato (dd.mm.åååå)');
        fyllFrist('');
        await waitFor(() =>
            expect(
                screen.queryByText('Skriv inn en gyldig dato (dd.mm.åååå)'),
            ).not.toBeInTheDocument(),
        );
    }

    sendInn();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('Venter på opplysninger', ''));
});

test('nullstiller datovalideringen når dialogen lukkes', async () => {
    const onSubmit = jest.fn();
    render(<DialogUtenNavigasjon onSubmit={onSubmit} />);
    fyllFrist('32.13.2099');
    sendInn();
    await screen.findByText('Skriv inn en gyldig dato (dd.mm.åååå)');
    fireEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Åpne dialog' }));
    expect(screen.queryByText('Skriv inn en gyldig dato (dd.mm.åååå)')).not.toBeInTheDocument();
    fyllBegrunnelse();
    sendInn();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('Venter på opplysninger', ''));
});
