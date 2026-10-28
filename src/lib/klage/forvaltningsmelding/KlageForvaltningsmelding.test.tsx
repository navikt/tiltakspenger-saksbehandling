/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Forvaltningsmelding, Klagebehandling } from '~/lib/klage/typer/Klage';
import KlageForvaltningsmelding from './KlageForvaltningsmelding';

const forvaltningsmelding: Forvaltningsmelding = {
    tekster: [],
    saksbehandler: 'Z12345',
    sendtTidspunkt: '2025-04-02T09:15:00',
    journalpostId: null,
    journalføringstidspunkt: null,
    distribusjonstidspunkt: null,
};

const renderSendt = (overstyr: Partial<Forvaltningsmelding> = {}) =>
    render(
        <KlageForvaltningsmelding
            klage={
                {
                    id: 'klage_1',
                    sakId: 'sak_1',
                    forvaltningsmelding: { ...forvaltningsmelding, ...overstyr },
                } as unknown as Klagebehandling
            }
            onSendt={jest.fn()}
        />,
    );

describe('KlageForvaltningsmelding når meldingen er sendt', () => {
    test('viser journalpost-ID og distribusjonstidspunkt', () => {
        renderSendt({
            journalpostId: '987654321',
            journalføringstidspunkt: '2025-04-02T09:20:00',
            distribusjonstidspunkt: '2025-04-02T10:30:00',
        });

        expect(screen.getByText('Z12345')).toBeInTheDocument();
        expect(screen.getByText('02.04.2025 kl. 09:15')).toBeInTheDocument();
        expect(screen.getByText('987654321')).toBeInTheDocument();
        expect(screen.getByText('02.04.2025 kl. 10:30')).toBeInTheDocument();
    });

    test('sier fra når meldingen ennå ikke er journalført og distribuert', () => {
        renderSendt();

        expect(screen.getByText('Ikke journalført ennå')).toBeInTheDocument();
        expect(screen.getByText('Ikke distribuert ennå')).toBeInTheDocument();
    });
});
