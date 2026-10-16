/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import SettKlagebehandlingPåVentModal from './SettKlagebehandlingPåVentModal';

const DialogUtenNavigasjon = ({
    onSubmit,
}: {
    onSubmit: (begrunnelse: string, frist: string | null) => void;
}) => {
    const [åpen, setÅpen] = useState(true);
    return (
        <>
            <Button onClick={() => setÅpen(true)}>Åpne dialog</Button>
            <SettKlagebehandlingPåVentModal
                åpen={åpen}
                onClose={() => setÅpen(false)}
                api={{
                    trigger: (begrunnelse, frist) => {
                        onSubmit(begrunnelse, frist);
                        setÅpen(false);
                    },
                    isMutating: false,
                    error: null,
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

const sendInn = () =>
    fireEvent.click(screen.getByRole('button', { name: 'Sett behandling på vent' }));

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
