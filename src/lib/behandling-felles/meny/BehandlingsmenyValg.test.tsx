/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { SaksbehandlerBehandlingKommando as Kommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { BehandlingsmenyValg } from './BehandlingsmenyValg';

const åpneMeny = async (gyldigeKommandoer: Kommando[]) => {
    render(<BehandlingsmenyValg gyldigeKommandoer={gyldigeKommandoer} onVelg={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Meny' }));
    return screen.findAllByRole('menuitem');
};

const menyvalg = (elementer: HTMLElement[]) => elementer.map((element) => element.textContent);

/**
 * Backend gir HentTilbake bare til saksbehandlere på automatisk behandlede søknadsbehandlinger
 * som er klare til beslutning, og TildelBeslutter bare til besluttere.
 */
describe('BehandlingsmenyValg - automatisk behandlet og klar til beslutning', () => {
    test('med begge rollene vises begge handlingene', async () => {
        const valg = await åpneMeny([Kommando.TildelBeslutter, Kommando.HentTilbake]);

        expect(menyvalg(valg)).toEqual([
            'Tildel meg som beslutter',
            'Hent tilbake som saksbehandler',
        ]);
    });

    test('med bare saksbehandlerrollen vises bare henting tilbake', async () => {
        const valg = await åpneMeny([Kommando.HentTilbake]);

        expect(menyvalg(valg)).toEqual(['Hent tilbake som saksbehandler']);
    });

    test('med bare beslutterrollen vises vanlig tildeling', async () => {
        const valg = await åpneMeny([Kommando.TildelBeslutter]);

        expect(menyvalg(valg)).toEqual(['Tildel meg']);
    });
});
