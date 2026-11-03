import type { Page } from '@playwright/test';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import type { SakProps } from '~/lib/sak/SakTyper';
import { ikkeSladdet } from '~test/sladdetVerdi';
import {
    expect,
    fellesHandlere,
    forventOverskrift,
    http,
    HttpResponse,
    test,
} from '../felles/e2eFelles';
import { lagSakMedBlandetInnhold, SAKSNUMMER } from './personoversiktTestUtils';
import { tilTidspunkt } from '~/types/DatoTid';

type AvbrytRequest = { begrunnelse: string; behandlingId: string };

/** Saken backend svarer med etter at den åpne søknadsbehandlingen er avsluttet */
const sakEtterAvslutning = (): SakProps => {
    const før = lagSakMedBlandetInnhold();

    return {
        ...før,
        åpneBehandlinger: før.åpneBehandlinger.filter((åpen) => åpen.id !== 'beh_apen'),
        rammebehandlinger: før.rammebehandlinger.map((behandling) =>
            behandling.id === 'beh_apen'
                ? {
                      ...behandling,
                      status: Rammebehandlingsstatus.AVBRUTT,
                      gyldigeKommandoer: [],
                      avbrutt: {
                          avbruttAv: 'Z123456',
                          avbruttTidspunkt: tilTidspunkt('2025-04-10T08:00:00'),
                          begrunnelse: ikkeSladdet('Søknaden er trukket'),
                      },
                  }
                : behandling,
        ),
    };
};

const åpneAvsluttDialog = async (page: Page) => {
    await page
        .getByRole('row')
        .filter({ hasText: 'Søknadsbehandling' })
        .getByRole('button', { name: 'Meny' })
        .click();
    await page.getByRole('menuitem', { name: 'Avslutt behandling' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Avslutt behandlingen?');
    await expect(dialog).toContainText(
        'Hvis du avslutter behandlingen blir også søknaden avsluttet.',
    );
    return dialog;
};

test.describe('Personoversikten - avslutte behandling', () => {
    test('avslutter en åpen behandling fra menyen med begrunnelse', async ({ page, msw }) => {
        const avbrytKall: AvbrytRequest[] = [];

        msw.use(
            http.post('*/sak/:saksnummer/avbryt-aktiv-behandling', async ({ request, params }) => {
                expect(params.saksnummer).toBe(SAKSNUMMER);
                avbrytKall.push((await request.json()) as AvbrytRequest);
                return HttpResponse.json(sakEtterAvslutning());
            }),
            http.get('*/sak/:saksnummer', () => HttpResponse.json(lagSakMedBlandetInnhold())),
            ...fellesHandlere(),
        );

        await page.goto(`/sak/${SAKSNUMMER}`);
        await forventOverskrift(page, 'Personoversikt');

        const dialog = await åpneAvsluttDialog(page);

        // Begrunnelse er påkrevd
        await dialog.getByRole('button', { name: 'Avslutt behandling', exact: true }).click();
        await expect(dialog.getByText('Du må fylle ut en begrunnelse')).toBeVisible();
        expect(avbrytKall).toHaveLength(0);

        await dialog
            .getByRole('textbox', { name: 'Hvorfor avsluttes behandlingen? (obligatorisk)' })
            .fill('  Søknaden er trukket  ');
        await expect(dialog.getByText('Du må fylle ut en begrunnelse')).toBeHidden();
        await dialog.getByRole('button', { name: 'Avslutt behandling', exact: true }).click();

        await expect
            .poll(() => avbrytKall)
            .toEqual([{ begrunnelse: 'Søknaden er trukket', behandlingId: 'beh_apen' }]);

        await expect(page.getByRole('dialog')).toBeHidden();
        await expect(page.getByText('Behandlingen er avsluttet')).toBeVisible();

        // Saken oppdateres i konteksten uten ny innlasting
        await expect(page).toHaveURL(new RegExp(`/sak/${SAKSNUMMER}`));
        await expect(page.getByRole('tab', { name: 'Åpne behandlinger (3)' })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'Avsluttede behandlinger (2)' })).toBeVisible();
        await expect(page.getByRole('row').filter({ hasText: 'Søknadsbehandling' })).toHaveCount(0);
    });

    test('viser feil fra backend og lar dialogen stå åpen', async ({ page, msw }) => {
        msw.use(
            http.post('*/sak/:saksnummer/avbryt-aktiv-behandling', () =>
                HttpResponse.json(
                    { melding: 'Noe gikk galt', kode: 'ukjent_feil' },
                    { status: 500 },
                ),
            ),
            http.get('*/sak/:saksnummer', () => HttpResponse.json(lagSakMedBlandetInnhold())),
            ...fellesHandlere(),
        );

        await page.goto(`/sak/${SAKSNUMMER}`);
        await forventOverskrift(page, 'Personoversikt');

        const dialog = await åpneAvsluttDialog(page);
        await dialog
            .getByRole('textbox', { name: 'Hvorfor avsluttes behandlingen? (obligatorisk)' })
            .fill('Søknaden er trukket');
        await dialog.getByRole('button', { name: 'Avslutt behandling', exact: true }).click();

        await expect(dialog.getByText('Feil ved avslutning')).toBeVisible();
        await expect(dialog).toContainText('(kode 500)');
        await expect(dialog).toBeVisible();

        await dialog.getByRole('button', { name: 'Ikke avslutt behandling' }).click();
        await expect(page.getByRole('tab', { name: 'Åpne behandlinger (4)' })).toBeVisible();
    });

    test('«Ikke avslutt behandling» lukker dialogen uten å kalle backend', async ({
        page,
        msw,
    }) => {
        const avbrytKall: unknown[] = [];

        msw.use(
            http.post('*/sak/:saksnummer/avbryt-aktiv-behandling', async ({ request }) => {
                avbrytKall.push(await request.json());
                return HttpResponse.json(sakEtterAvslutning());
            }),
            http.get('*/sak/:saksnummer', () => HttpResponse.json(lagSakMedBlandetInnhold())),
            ...fellesHandlere(),
        );

        await page.goto(`/sak/${SAKSNUMMER}`);
        await forventOverskrift(page, 'Personoversikt');

        const dialog = await åpneAvsluttDialog(page);
        await dialog.getByRole('button', { name: 'Ikke avslutt behandling' }).click();

        await expect(page.getByRole('dialog')).toBeHidden();
        expect(avbrytKall).toHaveLength(0);
        await expect(page.getByRole('tab', { name: 'Åpne behandlinger (4)' })).toBeVisible();
    });

    test('tilbyr ikke avslutning når backend ikke gir kommandoen', async ({ page, msw }) => {
        msw.use(
            http.get('*/sak/:saksnummer', () => HttpResponse.json(lagSakMedBlandetInnhold())),
            ...fellesHandlere(),
        );

        await page.goto(`/sak/${SAKSNUMMER}`);
        await forventOverskrift(page, 'Personoversikt');

        // Revurderingen har bare TildelSaksbehandler som gyldig kommando
        await page
            .getByRole('row')
            .filter({ hasText: 'Revurdering' })
            .getByRole('button', { name: 'Meny' })
            .click();

        await expect(page.getByRole('menuitem', { name: 'Tildel meg' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Avslutt behandling' })).toHaveCount(0);
    });
});
