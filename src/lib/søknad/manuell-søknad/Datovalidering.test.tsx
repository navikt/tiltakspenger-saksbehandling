/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Button } from '@navikt/ds-react';
import { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ManueltRegistrertSøknad } from './ManueltRegistrertSøknad';
import { SpørsmålMedDatovelger } from './SpørsmålMedDatovelger';
import { Periodevelger } from './Periodevelger';
import { SpørsmålMedPeriodevelger } from './SpørsmålMedPeriodevelger';

const ugyldigDato = 'Skriv inn en gyldig dato (dd.mm.åååå)';

const Skjema = ({
    onSubmit,
    children,
}: PropsWithChildren<{ onSubmit: (data: ManueltRegistrertSøknad) => void }>) => {
    const form = useForm<ManueltRegistrertSøknad>({
        defaultValues: { svar: { alderspensjon: { svar: 'JA' }, kvp: { svar: 'JA' } } },
    });
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {children}
                <Button type="submit">Send</Button>
            </form>
        </FormProvider>
    );
};

const fyllDato = (name: string | RegExp, value: string) =>
    fireEvent.change(screen.getByRole('textbox', { name }), { target: { value } });

const sendInn = () => fireEvent.click(screen.getByRole('button', { name: 'Send' }));

const renderDato = () => {
    const onSubmit = jest.fn<(data: ManueltRegistrertSøknad) => void>();
    render(
        <Skjema onSubmit={onSubmit}>
            <SpørsmålMedDatovelger
                spørsmålFelt="svar.alderspensjon.svar"
                datoFelt="svar.alderspensjon.fraOgMed"
                legend="Mottar alderspensjon"
            />
        </Skjema>,
    );
    return onSubmit;
};

describe('SpørsmålMedDatovelger', () => {
    test('stopper ugyldig dato og tillater retting til en dato i fortiden', async () => {
        const onSubmit = renderDato();
        fyllDato(/Fra og med/, '32.13.2099');
        sendInn();
        expect(await screen.findByText(ugyldigDato)).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();

        fyllDato(/Fra og med/, '01.01.2000');
        await waitFor(() => expect(screen.queryByText(ugyldigDato)).not.toBeInTheDocument());
        sendInn();
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        expect(onSubmit.mock.calls[0][0].svar.alderspensjon.fraOgMed).toBe('2000-01-01');
    });

    test.each(['', '32.13.2099'])('tillater tom dato etter startverdi "%s"', async (dato) => {
        const onSubmit = renderDato();
        if (dato) {
            fyllDato(/Fra og med/, dato);
            sendInn();
            await screen.findByText(ugyldigDato);
            fyllDato(/Fra og med/, '');
            await waitFor(() => expect(screen.queryByText(ugyldigDato)).not.toBeInTheDocument());
        }
        sendInn();
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        expect(onSubmit.mock.calls[0][0].svar.alderspensjon.fraOgMed).toBeUndefined();
    });

    test('skjult datofelt blokkerer ikke innsending og starter uten gammel feil', async () => {
        const onSubmit = renderDato();
        fyllDato(/Fra og med/, '32.13.2099');
        sendInn();
        await screen.findByText(ugyldigDato);

        fireEvent.click(screen.getByRole('radio', { name: 'Nei' }));
        sendInn();
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        expect(onSubmit.mock.calls[0][0].svar.alderspensjon.fraOgMed).toBeUndefined();

        fireEvent.click(screen.getByRole('radio', { name: 'Ja' }));
        expect(screen.queryByText(ugyldigDato)).not.toBeInTheDocument();
        sendInn();
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2));
    });
});

describe('Periodevelger', () => {
    test.each(['Fra og med', 'Til og med'])(
        'stopper ugyldig %s selv uten ekstra valideringsregler',
        async (felt) => {
            const onSubmit = jest.fn<(data: ManueltRegistrertSøknad) => void>();
            render(
                <Skjema onSubmit={onSubmit}>
                    <Periodevelger periodeFelt="manueltSattSøknadsperiode" />
                </Skjema>,
            );
            fyllDato(felt, '32.13.2099');
            sendInn();
            expect(await screen.findByText(ugyldigDato)).toBeInTheDocument();
            expect(onSubmit).not.toHaveBeenCalled();

            fyllDato(felt, '01.01.2000');
            await waitFor(() => expect(screen.queryByText(ugyldigDato)).not.toBeInTheDocument());
            sendInn();
            await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
            expect(onSubmit.mock.calls[0][0].manueltSattSøknadsperiode).toEqual(
                expect.objectContaining({
                    [felt === 'Fra og med' ? 'fraOgMed' : 'tilOgMed']: '2000-01-01',
                }),
            );
        },
    );

    test('valgfrie datofelt kan være tomme, også etter ugyldig inntasting', async () => {
        const onSubmit = jest.fn();
        render(
            <Skjema onSubmit={onSubmit}>
                <Periodevelger periodeFelt="manueltSattSøknadsperiode" />
            </Skjema>,
        );
        sendInn();
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

        fyllDato('Fra og med', '32.13.2099');
        fyllDato('Til og med', '32.13.2099');
        await waitFor(() => expect(screen.getAllByText(ugyldigDato)).toHaveLength(2));
        sendInn();
        await waitFor(() => expect(screen.getAllByText(ugyldigDato)).toHaveLength(2));
        expect(onSubmit).toHaveBeenCalledTimes(1);

        fyllDato('Fra og med', '');
        fyllDato('Til og med', '');
        await waitFor(() => expect(screen.queryByText(ugyldigDato)).not.toBeInTheDocument());
        sendInn();
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2));
    });

    test('beholder ekstra regler for påkrevde datoer og perioderekkefølge', async () => {
        const onSubmit = jest.fn<(data: ManueltRegistrertSøknad) => void>();
        render(
            <Skjema onSubmit={onSubmit}>
                <Periodevelger
                    periodeFelt="manueltSattSøknadsperiode"
                    validate={({ fraOgMed, tilOgMed }) => ({
                        fraOgMed: !fraOgMed ? 'Fra og med er påkrevd.' : undefined,
                        tilOgMed: !tilOgMed ? 'Til og med er påkrevd.' : undefined,
                        periode:
                            fraOgMed && tilOgMed && fraOgMed > tilOgMed
                                ? 'Ugyldig periode.'
                                : undefined,
                    })}
                />
            </Skjema>,
        );
        sendInn();
        await screen.findByText('Fra og med er påkrevd.');
        await screen.findByText('Til og med er påkrevd.');
        expect(onSubmit).not.toHaveBeenCalled();

        fyllDato('Fra og med', '32.13.2099');
        expect(await screen.findByText(ugyldigDato)).toBeInTheDocument();
        fyllDato('Fra og med', '02.01.2099');
        fyllDato('Til og med', '01.01.2099');
        expect(await screen.findByText('Ugyldig periode.')).toBeInTheDocument();
        sendInn();
        await waitFor(() => expect(screen.getByText('Ugyldig periode.')).toBeInTheDocument());
        expect(onSubmit).not.toHaveBeenCalled();

        fyllDato('Til og med', '03.01.2099');
        await waitFor(() => expect(screen.queryByText('Ugyldig periode.')).not.toBeInTheDocument());
        sendInn();
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        expect(onSubmit.mock.calls[0][0].manueltSattSøknadsperiode).toEqual({
            fraOgMed: '2099-01-02',
            tilOgMed: '2099-01-03',
        });
    });

    test('en skjult periode blokkerer ikke innsending', async () => {
        const onSubmit = jest.fn();
        render(
            <Skjema onSubmit={onSubmit}>
                <SpørsmålMedPeriodevelger
                    spørsmålFelt="svar.kvp.svar"
                    periodeFelt="svar.kvp.periode"
                    spørsmål="Mottar kvalifiseringsstønad"
                />
            </Skjema>,
        );
        fyllDato('Fra og med', '32.13.2099');
        sendInn();
        await screen.findByText(ugyldigDato);
        fireEvent.click(screen.getByRole('radio', { name: 'Nei' }));
        sendInn();
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

        fireEvent.click(screen.getByRole('radio', { name: 'Ja' }));
        expect(screen.queryByText(ugyldigDato)).not.toBeInTheDocument();
        sendInn();
        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2));
    });
});
