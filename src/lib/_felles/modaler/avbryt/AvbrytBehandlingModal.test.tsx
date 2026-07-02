/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import AvbrytBehandlingModal from './AvbrytBehandlingModal';
import { FetcherError } from '~/utils/fetch/fetch';

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

type Footer = React.ComponentProps<typeof AvbrytBehandlingModal>['footer'];

const renderModal = (footer?: Footer, tittel?: string) => {
    const onSubmit = jest.fn((e: React.SubmitEvent<HTMLFormElement>) => e.preventDefault());
    const onClose = jest.fn();

    render(
        <AvbrytBehandlingModal
            åpen
            onClose={onClose}
            onSubmit={onSubmit}
            bodyInnhold={<div>begrunnelse</div>}
            tittel={tittel}
            footer={footer}
        />,
    );

    // Modalen rendres i en portal, så form-elementet ligger i document.
    const submit = () => fireEvent.submit(document.querySelector('form')!);

    return { onSubmit, onClose, submit };
};

const feilMedStatus = (status: number) =>
    new FetcherError({ status, message: `Feil med status ${status}` });

describe('AvbrytBehandlingModal', () => {
    test('avbryter og det går fint: submit sendes videre, ingen lenke til personoversikten', () => {
        const { onSubmit, submit } = renderModal({ isMutating: false, error: null });

        submit();

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: 'Avslutt behandling' })).toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: 'Gå til personoversikten' }),
        ).not.toBeInTheDocument();
    });

    test('404 (terminal): viser lenke til personoversikten, blokkerer nytt forsøk', () => {
        const { onSubmit, submit } = renderModal({
            isMutating: false,
            error: feilMedStatus(404),
            saksnummer: '12345678',
        });

        expect(screen.getByRole('link', { name: 'Gå til personoversikten' })).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'Avslutt behandling' }),
        ).not.toBeInTheDocument();

        // Nytt forsøk hjelper ikke på terminale feil, så vi oppfordrer ikke til det.
        expect(screen.queryByText(/prøv igjen om litt/i)).not.toBeInTheDocument();

        submit();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test('409 (terminal): viser lenke til personoversikten, blokkerer nytt forsøk', () => {
        const { onSubmit, submit } = renderModal({
            isMutating: false,
            error: feilMedStatus(409),
            saksnummer: '12345678',
        });

        expect(screen.getByRole('link', { name: 'Gå til personoversikten' })).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'Avslutt behandling' }),
        ).not.toBeInTheDocument();

        submit();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    test('500 (ukjent serverfeil): viser backend sin feilmelding og oppfordrer til nytt forsøk', () => {
        const { onSubmit, submit } = renderModal({
            isMutating: false,
            error: feilMedStatus(500),
            saksnummer: '12345678',
        });

        // Vi viser det backend faktisk sender ...
        expect(screen.getByText('Feil med status 500')).toBeInTheDocument();
        // ... men sier likevel fra om at hen kan prøve igjen om litt.
        expect(screen.getByText(/prøv igjen om litt/i)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Avslutt behandling' })).toBeInTheDocument();
        expect(
            screen.queryByRole('link', { name: 'Gå til personoversikten' }),
        ).not.toBeInTheDocument();

        submit();
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    test('terminal feil: klikk på "Gå til personoversikten" lukker modalen', () => {
        const { onClose } = renderModal({
            isMutating: false,
            error: feilMedStatus(404),
            saksnummer: '12345678',
        });

        fireEvent.click(screen.getByRole('link', { name: 'Gå til personoversikten' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('feilmeldingen vises i body sammen med info-boksen, ikke i footeren med knappene', () => {
        renderModal({ isMutating: false, error: feilMedStatus(500) });

        const feil = screen.getByText('Feil med status 500');
        const infoboks = screen.getByText(/Bruker får ikke innsyn/);
        const lukkKnapp = screen.getByRole('button', { name: 'Ikke avslutt behandling' });

        // Feilen skal dele container (body) med info-boksen ...
        const body = feil.closest('.aksel-modal__body');
        expect(body).not.toBeNull();
        expect(body).toContainElement(infoboks);
        // ... og ikke ligge i footeren sammen med handlingsknappene (der den sprengte ut).
        expect(body).not.toContainElement(lukkKnapp);
    });

    test('aria-label på modalen følger tittel (for skjermlesere)', () => {
        renderModal({ isMutating: false, error: null }, 'Avbryt klagebehandling');

        expect(screen.getByRole('dialog', { name: 'Avbryt klagebehandling' })).toBeInTheDocument();
    });
});
