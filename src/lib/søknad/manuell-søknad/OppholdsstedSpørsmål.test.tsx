/** @jest-environment jsdom */
import { expect, test } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ManueltRegistrertSøknad } from '~/lib/søknad/manuell-søknad/ManueltRegistrertSøknad';
import { OppholdsstedSpørsmål } from './OppholdsstedSpørsmål';

const navn = 'svar.barnetilleggKladd.oppholdssted.svar';

const Skjema = ({ onSubmit }: { onSubmit: (data: ManueltRegistrertSøknad) => void }) => {
    const form = useForm<ManueltRegistrertSøknad>();
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <OppholdsstedSpørsmål name={navn} legend="Oppholdssted i tiltaksperioden" />
                <button type="submit">Send</button>
            </form>
        </FormProvider>
    );
};

test('viser de tre oppholdsstedene og ikke besvart', () => {
    render(<Skjema onSubmit={() => {}} />);

    expect(screen.getByRole('radio', { name: 'Norge' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Annet EØS-land' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Land utenfor EØS' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Ikke besvart' })).toBeInTheDocument();
});

test('krever at et svar er valgt', async () => {
    render(<Skjema onSubmit={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('Du må velge et svar.')).toBeInTheDocument();
});

test('lagrer valgt oppholdssted i skjemaet', async () => {
    let innsendt: ManueltRegistrertSøknad | undefined;
    render(<Skjema onSubmit={(data) => (innsendt = data)} />);

    fireEvent.click(screen.getByRole('radio', { name: 'Annet EØS-land' }));
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() =>
        expect(innsendt?.svar.barnetilleggKladd?.oppholdssted?.svar).toBe('ANNET_EØS_LAND'),
    );
});
