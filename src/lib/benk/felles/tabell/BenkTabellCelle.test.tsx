/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { BenkBehandlingstype, BenkVentestatus } from '../../typer/felles';
import { BenkTabellCelle } from './BenkTabellCelle';

const renderVentestatus = (ventestatus: BenkVentestatus) =>
    render(
        <BenkTabellCelle.Ventestatus
            behandling={{ type: BenkBehandlingstype.SØKNADSBEHANDLING, ventestatus }}
        />,
    );

const påVent: BenkVentestatus = {
    erSattPåVent: true,
    begrunnelse: ikkeSladdet(null),
    frist: null,
    venterTil: null,
};

describe('BenkTabellCelle.Ventestatus', () => {
    test('viser frist og tidspunktet den automatiske behandlingen venter til hver for seg', () => {
        renderVentestatus({ ...påVent, frist: '2099-05-10', venterTil: '2099-05-02T06:00:00' });

        expect(screen.getByText('Frist 10.05.2099')).toBeInTheDocument();
        expect(screen.getByText('Venter til 02.05.99 06:00')).toBeInTheDocument();
        expect(screen.queryByText('Venter')).not.toBeInTheDocument();
    });

    test('viser bare venter til når behandlingen ikke har frist', () => {
        renderVentestatus({ ...påVent, venterTil: '2099-05-02T06:00:00' });

        expect(screen.getByText('Venter til 02.05.99 06:00')).toBeInTheDocument();
        expect(screen.queryByText(/^Frist/)).not.toBeInTheDocument();
    });

    test('viser at behandlingen venter når den verken har frist eller venter til', () => {
        renderVentestatus(påVent);

        expect(screen.getByText('Venter')).toBeInTheDocument();
    });
});
