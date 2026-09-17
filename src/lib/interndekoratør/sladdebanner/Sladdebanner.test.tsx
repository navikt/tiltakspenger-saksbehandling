/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Sladdebanner } from './Sladdebanner';
import { SaksbehandlerProvider } from '~/lib/saksbehandler/SaksbehandlerContext';
import { Saksbehandler, SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';

const lagSaksbehandler = (sladdes: boolean, ...roller: SaksbehandlerRolle[]): Saksbehandler => ({
    brukernavn: 'Test Testesen',
    epost: 'test.testesen@nav.no',
    navIdent: 'Z12345',
    roller,
    sladdes,
    kanSeBenken: true,
});

const rendreBanner = (saksbehandler: Saksbehandler) =>
    render(
        <SaksbehandlerProvider initialSaksbehandler={saksbehandler}>
            <Sladdebanner />
        </SaksbehandlerProvider>,
    );

test('viser sladdebanner når saksbehandler har sladdede opplysninger', () => {
    rendreBanner(lagSaksbehandler(true, SaksbehandlerRolle.UTVIKLER));

    expect(screen.getByText(Sladdebanner.Tekst)).toBeInTheDocument();
});

test('viser ikke sladdebanner for saksbehandler med fullt innsyn', () => {
    rendreBanner(lagSaksbehandler(false, SaksbehandlerRolle.SAKSBEHANDLER));

    expect(screen.queryByText(Sladdebanner.Tekst)).not.toBeInTheDocument();
});
