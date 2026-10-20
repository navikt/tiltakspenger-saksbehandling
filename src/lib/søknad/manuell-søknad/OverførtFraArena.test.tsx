/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Button } from '@navikt/ds-react';
import { FormProvider, useForm } from 'react-hook-form';
import {
    ManueltRegistrertSøknad,
    SøknadBehandlingsårsakManueltRegistrertSøknad,
} from './ManueltRegistrertSøknad';
import { OverførtFraArenaSpørsmål } from './OverførtFraArenaSpørsmål';
import { ManueltSattSøknadMottattDato } from './ManueltSattSøknadMottattDato';

const datoLabel = 'Velg datoen søknaden ble mottatt';
const påkrevdDato = 'Dato for når søknaden ble mottatt er påkrevd.';

const Skjema = ({ onSubmit }: { onSubmit: (data: ManueltRegistrertSøknad) => void }) => {
    const form = useForm<ManueltRegistrertSøknad>();
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <ManueltSattSøknadMottattDato />
                <OverførtFraArenaSpørsmål />
                <Button type="submit">Send</Button>
            </form>
        </FormProvider>
    );
};

const renderSkjema = () => {
    const onSubmit = jest.fn<(data: ManueltRegistrertSøknad) => void>();
    render(<Skjema onSubmit={onSubmit} />);
    return onSubmit;
};

const svarArena = (svar: 'Ja' | 'Nei') =>
    fireEvent.click(screen.getByRole('radio', { name: svar }));

const fyllMottattDato = (dato: string) =>
    fireEvent.change(screen.getByRole('textbox', { name: datoLabel }), {
        target: { value: dato },
    });

const velgBehandlingsårsak = () =>
    fireEvent.change(screen.getByRole('combobox', { name: 'Behandlingsårsak' }), {
        target: { value: SøknadBehandlingsårsakManueltRegistrertSøknad.ANNET },
    });

const sendInn = () => fireEvent.click(screen.getByRole('button', { name: 'Send' }));

describe('Mottatt-dato ved overføring fra Arena', () => {
    test('skjuler datofeltet når søknaden er overført fra Arena', () => {
        renderSkjema();
        expect(screen.getByRole('textbox', { name: datoLabel })).toBeInTheDocument();

        svarArena('Ja');
        expect(screen.queryByRole('textbox', { name: datoLabel })).not.toBeInTheDocument();

        svarArena('Nei');
        expect(screen.getByRole('textbox', { name: datoLabel })).toBeInTheDocument();
    });

    test('krever dato når søknaden ikke er overført fra Arena', async () => {
        const onSubmit = renderSkjema();
        svarArena('Nei');
        sendInn();

        expect(await screen.findByText(påkrevdDato)).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test('sender ikke med dato som ble valgt før saksbehandler svarte ja', async () => {
        const onSubmit = renderSkjema();
        svarArena('Nei');
        sendInn();
        await screen.findByText(påkrevdDato);
        fyllMottattDato('01.01.2025');

        svarArena('Ja');
        velgBehandlingsårsak();
        sendInn();

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        const data = onSubmit.mock.calls[0][0];
        expect(data.manueltSattSøknadMottattDato).toBeUndefined();
        expect(data.behandlingsarsak).toBe(SøknadBehandlingsårsakManueltRegistrertSøknad.ANNET);

        svarArena('Nei');
        expect(screen.queryByText(påkrevdDato)).not.toBeInTheDocument();
    });

    test('sender ikke med behandlingsårsak som ble valgt før saksbehandler svarte nei', async () => {
        const onSubmit = renderSkjema();
        svarArena('Ja');
        velgBehandlingsårsak();

        svarArena('Nei');
        fyllMottattDato('01.01.2025');
        sendInn();

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        const data = onSubmit.mock.calls[0][0];
        expect(data.behandlingsarsak).toBeUndefined();
        expect(data.manueltSattSøknadMottattDato).toBe('2025-01-01');
    });
});
