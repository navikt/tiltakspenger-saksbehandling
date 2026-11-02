import {
    BESLUTTER_IDENT,
    SAKSBEHANDLER_IDENT,
    SIDELAST_TIMEOUT,
    expect,
    fellesHandlere,
    forventOverskrift,
    lagBeslutter,
    test,
} from '../felles/e2eFelles';
import type { Page } from '@playwright/test';
import { innvilgelsesperiode, periode, søknadsbehandlingInnvilgelse } from '~test/rammebehandling';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    BEHANDLING_ID,
    SAK_ID,
    behandlingssideUrl,
    beslutterensKommandoer,
    lagSøknad,
    lagSøknadsbehandlingBackend,
    personoversiktUrl,
} from './soknadsbehandlingTestUtils';
import type { TaBehandlingRequest } from './soknadsbehandlingTestUtils';

const innvilgelseSendtTilBeslutning = (
    overstyringer: Parameters<typeof søknadsbehandlingInnvilgelse>[0] = {},
) =>
    søknadsbehandlingInnvilgelse({
        søknad: lagSøknad(),
        status: Rammebehandlingsstatus.KLAR_TIL_BESLUTNING,
        saksbehandler: SAKSBEHANDLER_IDENT,
        beslutter: null,
        innvilgelsesperioder: [innvilgelsesperiode(periode('2025-01-01', '2025-03-31'))],
        begrunnelseVilkårsvurdering: ikkeSladdet('Bruker oppfyller vilkårene.'),
        fritekstTilVedtaksbrev: ikkeSladdet('Du får tiltakspenger.'),
        // Beslutteren kan bare ta behandlingen før den er tildelt
        gyldigeKommandoer: [SaksbehandlerBehandlingKommando.TildelBeslutter],
        ...overstyringer,
    });

const vedtakOverskrift = (page: Page) =>
    page.getByRole('heading', { name: 'Vedtak (søknadsbehandling)', level: 1 });

const forventTildeltBeslutter = (kall: TaBehandlingRequest[]) =>
    expect(kall).toEqual([
        { behandlinger: [{ behandlingId: BEHANDLING_ID, sakId: SAK_ID }], returnerSaker: true },
    ] satisfies TaBehandlingRequest[]);

test.describe('Søknadsbehandling - beslutter', () => {
    test('beslutter tildeler seg behandlingen og godkjenner vedtaket', async ({ page, msw }) => {
        const backend = lagSøknadsbehandlingBackend(
            innvilgelseSendtTilBeslutning(),
            BESLUTTER_IDENT,
        );
        msw.use(...fellesHandlere(lagBeslutter()), ...backend.handlere);

        await page.goto(behandlingssideUrl);
        await expect(vedtakOverskrift(page)).toBeVisible({ timeout: SIDELAST_TIMEOUT });

        // Før tildeling kan beslutteren bare se behandlingen
        await expect(page.getByRole('button', { name: 'Godkjenn vedtaket' })).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Underkjenn' })).toHaveCount(0);
        await expect(
            page.getByRole('textbox', { name: 'Begrunnelse vilkårsvurdering', exact: true }),
        ).toHaveAttribute('readonly');

        await page.getByRole('button', { name: 'Meny' }).click();
        await page.getByRole('menuitem', { name: 'Tildel meg' }).click();

        const godkjennKnapp = page.getByRole('button', { name: 'Godkjenn vedtaket' });
        await expect(godkjennKnapp).toBeVisible();
        await expect(page.getByRole('dialog')).toHaveCount(0);
        forventTildeltBeslutter(backend.kall.ta);
        await expect(page.getByText(BESLUTTER_IDENT).first()).toBeVisible();

        await godkjennKnapp.click();

        const dialog = page.getByRole('dialog');
        await expect(dialog.getByText('Godkjenn vedtaket?')).toBeVisible();
        await dialog.getByRole('button', { name: 'Godkjenn vedtaket' }).click();

        await expect(page.getByText('Vedtaket er godkjent.')).toBeVisible();
        await forventOverskrift(page, 'Personoversikt');
        await expect(page).toHaveURL(new RegExp(`${personoversiktUrl}$`));

        expect(backend.kall.iverksett).toBe(1);
        expect(backend.hentBehandling().status).toBe(Rammebehandlingsstatus.VEDTATT);
        await expect(page.getByText('Ingen åpne behandlinger på denne saken')).toBeVisible();
    });

    test('beslutter kan tildele seg behandlingen fra personoversikten', async ({ page, msw }) => {
        const backend = lagSøknadsbehandlingBackend(
            innvilgelseSendtTilBeslutning(),
            BESLUTTER_IDENT,
        );
        msw.use(...fellesHandlere(lagBeslutter()), ...backend.handlere);

        await page.goto(personoversiktUrl);
        await forventOverskrift(page, 'Personoversikt');

        const rad = page.getByRole('row').filter({ hasText: 'Søknadsbehandling' });
        await expect(rad.getByText('Klar til beslutning')).toBeVisible();
        await expect(rad.getByRole('button', { name: 'Se behandling' })).toBeVisible();

        await rad.getByRole('button', { name: 'Meny' }).click();
        await page.getByRole('menuitem', { name: 'Tildel meg' }).click();

        await expect(page).toHaveURL(new RegExp(`${behandlingssideUrl}$`));
        await expect(vedtakOverskrift(page)).toBeVisible({ timeout: SIDELAST_TIMEOUT });
        await expect(page.getByRole('button', { name: 'Godkjenn vedtaket' })).toBeVisible();
        forventTildeltBeslutter(backend.kall.ta);
    });

    test('beslutter underkjenner vedtaket med begrunnelse', async ({ page, msw }) => {
        const backend = lagSøknadsbehandlingBackend(
            innvilgelseSendtTilBeslutning({
                status: Rammebehandlingsstatus.UNDER_BESLUTNING,
                beslutter: BESLUTTER_IDENT,
                gyldigeKommandoer: beslutterensKommandoer,
            }),
            BESLUTTER_IDENT,
        );
        msw.use(...fellesHandlere(lagBeslutter()), ...backend.handlere);

        await page.goto(behandlingssideUrl);
        await expect(vedtakOverskrift(page)).toBeVisible({ timeout: SIDELAST_TIMEOUT });

        await page.getByRole('button', { name: 'Underkjenn' }).click();

        const dialog = page.getByRole('dialog');
        await expect(dialog.getByText('Underkjenn behandlingen?')).toBeVisible();

        await dialog.getByRole('button', { name: 'Underkjenn' }).click();
        await expect(dialog.getByText('Begrunnelse er påkrevd')).toBeVisible();

        await dialog.getByRole('textbox', { name: 'Begrunnelse' }).fill('   ');
        await dialog.getByRole('button', { name: 'Underkjenn' }).click();
        await expect(dialog.getByText('Begrunnelse er påkrevd')).toBeVisible();

        await dialog
            .getByRole('textbox', { name: 'Begrunnelse' })
            .fill('  Innvilgelsesperioden må starte senere.  ');
        await expect(dialog.getByText('Begrunnelse er påkrevd')).toHaveCount(0);
        await dialog.getByRole('button', { name: 'Underkjenn' }).click();

        await expect(page.getByText('Vedtaket har blitt underkjent.')).toBeVisible();
        await forventOverskrift(page, 'Personoversikt');

        expect(backend.kall.underkjenn).toEqual([
            { begrunnelse: 'Innvilgelsesperioden må starte senere.' },
        ]);
        expect(backend.hentBehandling().status).toBe(Rammebehandlingsstatus.UNDER_BEHANDLING);

        const rad = page.getByRole('row').filter({ hasText: 'Søknadsbehandling' });
        await expect(rad.getByText('Under behandling')).toBeVisible();
        await expect(rad.getByText('Underkjent')).toBeVisible();
    });
});
