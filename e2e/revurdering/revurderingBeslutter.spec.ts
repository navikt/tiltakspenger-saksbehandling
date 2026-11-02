import { expect, fellesHandlere, forventOverskrift, lagBeslutter, test } from '../felles/e2eFelles';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    behandlingUrl,
    lagFalskBackend,
    lagStansKlarTilBeslutning,
    personoversiktUrl,
    REVURDERING_ID,
    SAK_ID,
} from './revurderingTestUtils';

test.describe('Beslutning av revurdering', () => {
    test('beslutter tildeler seg en revurdering til stans og iverksetter den', async ({
        page,
        msw,
    }) => {
        const backend = lagFalskBackend(lagStansKlarTilBeslutning());
        msw.use(...fellesHandlere(lagBeslutter()), ...backend.handlere);

        await page.goto(behandlingUrl);
        await forventOverskrift(page, 'Revurdering til stans av tiltakspenger');

        // Skjemaet er skrivebeskyttet, og vedtaket kan ikke godkjennes før beslutter har tatt behandlingen
        await expect(page.getByRole('textbox', { name: 'Stans fra og med' })).toHaveValue(
            '01.03.2025',
        );
        await expect(page.getByRole('textbox', { name: 'Stans fra og med' })).toHaveAttribute(
            'readonly',
        );
        await expect(page.getByRole('button', { name: 'Lagre', exact: true })).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Godkjenn vedtaket' })).toHaveCount(0);

        // 1. Tildel behandlingen til seg selv
        await page.getByRole('button', { name: 'Meny' }).click();
        await page.getByRole('menuitem', { name: 'Tildel meg' }).click();

        await expect(page.getByRole('button', { name: 'Godkjenn vedtaket' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Underkjenn' })).toBeVisible();
        expect(backend.tilstand.taBodies).toEqual([
            {
                behandlinger: [{ behandlingId: REVURDERING_ID, sakId: SAK_ID }],
                returnerSaker: true,
            },
        ]);
        expect(backend.tilstand.revurdering?.status).toBe(Rammebehandlingsstatus.UNDER_BESLUTNING);

        // 2. Godkjenn og iverksett vedtaket
        await page.getByRole('button', { name: 'Godkjenn vedtaket' }).click();
        // Dialogen har ikke tilgjengelig navn (overskriften er en <strong>, ikke Dialog.Title)
        const dialog = page.getByRole('dialog').filter({ hasText: 'Godkjenn vedtaket?' });
        await dialog.getByRole('button', { name: 'Godkjenn vedtaket' }).click();

        await expect(page).toHaveURL(personoversiktUrl, { timeout: 30_000 });
        await expect(page.getByText('Vedtaket er godkjent.')).toBeVisible();
        expect(backend.tilstand.antallIverksettinger).toBe(1);
        expect(backend.tilstand.revurdering?.status).toBe(Rammebehandlingsstatus.VEDTATT);
    });
});
