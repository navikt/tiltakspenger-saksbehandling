import { sak } from '~test/rammebehandling';
import {
    expect,
    fellesHandlere,
    forventOverskrift,
    http,
    HttpResponse,
    SAKSBEHANDLER_IDENT,
    test,
} from '../felles/e2eFelles';
import { lagSakMedBlandetInnhold, SAKSNUMMER } from './personoversiktTestUtils';

test.describe('Personoversikten - innhold', () => {
    test('viser antall per fane og innholdet i hver fane for en sak med blandet innhold', async ({
        page,
        msw,
    }) => {
        msw.use(
            http.get('*/sak/:saksnummer', () => HttpResponse.json(lagSakMedBlandetInnhold())),
            ...fellesHandlere(),
        );

        await page.goto(`/sak/${SAKSNUMMER}`);
        await forventOverskrift(page, 'Personoversikt');

        await expect(page.getByText(`Saksnr:`)).toBeVisible();
        await expect(page.getByRole('link', { name: 'Ola Nordmann' })).toBeVisible();
        await expect(page.getByText('12345678911')).toBeVisible();

        for (const fane of [
            'Åpne behandlinger (4)',
            'Meldekort (1)',
            'Vedtatte behandlinger (1)',
            'Klage (1)',
            'Tilbakekreving (2)',
            'Avsluttede behandlinger (1)',
        ]) {
            await expect(page.getByRole('tab', { name: fane })).toBeVisible();
        }

        // Åpne behandlinger er standardfanen
        await expect(page.getByRole('tab', { name: 'Åpne behandlinger (4)' })).toHaveAttribute(
            'aria-selected',
            'true',
        );
        await expect(page.getByRole('heading', { name: 'Åpne behandlinger (4)' })).toBeVisible();

        const søknadsbehandlingRad = page.getByRole('row').filter({ hasText: 'Søknadsbehandling' });
        await expect(søknadsbehandlingRad).toContainText('Ikke valgt');
        await expect(søknadsbehandlingRad).toContainText(SAKSBEHANDLER_IDENT);
        await expect(søknadsbehandlingRad).toContainText('01.04.2025 kl. 10:00');
        await expect(søknadsbehandlingRad.getByRole('button', { name: 'Fortsett' })).toBeVisible();
        await expect(søknadsbehandlingRad.getByRole('button', { name: 'Meny' })).toBeVisible();

        const revurderingRad = page.getByRole('row').filter({ hasText: 'Revurdering' });
        await expect(revurderingRad).toContainText('Stans');
        await expect(revurderingRad).toContainText('Ikke tildelt');
        await expect(revurderingRad.getByRole('button', { name: 'Se behandling' })).toBeVisible();

        const klageRad = page.getByRole('row').filter({ hasText: /^Klage/ });
        await expect(klageRad).toContainText('Under behandling');
        await expect(klageRad).toContainText('Z12345');

        const tilbakekrevingRad = page.getByRole('row').filter({ hasText: 'Tilbakekreving' });
        await expect(tilbakekrevingRad).toContainText(/Feilutbetalt: .*5\s000/);
        await expect(tilbakekrevingRad).toContainText('06.01.2025 - 19.01.2025');

        // Meldekort
        await page.getByRole('tab', { name: 'Meldekort (1)' }).click();
        await expect(page).toHaveURL(/#Meldekort$/);
        await expect(page.getByRole('radio', { name: 'Meldeperioder (1)' })).toBeVisible();
        const meldeperiodeRad = page
            .getByRole('row')
            .filter({ hasText: '06.01.2025 - 19.01.2025' });
        await expect(meldeperiodeRad).toContainText('Ikke mottatt (0)');
        await expect(meldeperiodeRad).toContainText('Ikke behandlet (0)');
        await expect(meldeperiodeRad).toContainText('Arbeidsmarkedsopplæring');
        await expect(meldeperiodeRad).toContainText('10 dager');
        await expect(meldeperiodeRad.getByRole('button', { name: 'Se oversikt' })).toBeVisible();

        // Vedtatte behandlinger
        await page.getByRole('tab', { name: 'Vedtatte behandlinger (1)' }).click();
        await expect(page).toHaveURL(/#vedtatte-behandlinger$/);
        const vedtakRad = page.getByRole('row').filter({ hasText: 'Søknadsbehandling' });
        await expect(vedtakRad).toContainText('Innvilgelse');
        await expect(vedtakRad).toContainText('01.01.2025 kl. 09:00');
        await expect(vedtakRad).toContainText('01.01.2025 - 31.03.2025');
        await expect(vedtakRad).toContainText('Z654321');
        await expect(vedtakRad.getByRole('button', { name: 'Se behandling' })).toBeVisible();

        // Klage
        await page.getByRole('tab', { name: 'Klage (1)' }).click();
        await expect(page).toHaveURL(/#Klage$/);
        await expect(page.getByRole('columnheader', { name: 'Utfall klageinstans' })).toBeVisible();
        const klageoversiktRad = page.getByRole('row').filter({ hasText: 'Under behandling' });
        await expect(klageoversiktRad).toContainText('03.04.2025 kl. 10:00');
        await expect(klageoversiktRad).toContainText('Z12345');

        // Tilbakekreving
        await page.getByRole('tab', { name: 'Tilbakekreving (2)' }).click();
        await expect(page).toHaveURL(/#Tilbakekreving$/);
        await expect(
            page.getByRole('heading', { name: 'Aktive tilbakekrevingssaker' }),
        ).toBeVisible();
        await expect(
            page.getByRole('heading', { name: 'Avsluttede tilbakekrevingssaker' }),
        ).toBeVisible();
        await expect(page.getByRole('row').filter({ hasText: /5\s000/ })).toContainText(
            'Rammebehandling',
        );
        await expect(page.getByRole('row').filter({ hasText: /1\s200/ })).toContainText('Z222222');

        // Avsluttede behandlinger
        await page.getByRole('tab', { name: 'Avsluttede behandlinger (1)' }).click();
        await expect(page).toHaveURL(/#avsluttede-behandlinger$/);
        const avbruttRad = page.getByRole('row').filter({ hasText: '10.02.2025 kl. 12:30' });
        await expect(avbruttRad).toContainText('Søknadsbehandling');
        await expect(avbruttRad).toContainText('Ingen periode');
        await expect(avbruttRad).toContainText('Z999999');
        await expect(avbruttRad.getByRole('button', { name: 'Se behandling' })).toBeVisible();
    });

    test('åpner fanen fra URL-hashen ved direkte lenke', async ({ page, msw }) => {
        msw.use(
            http.get('*/sak/:saksnummer', () => HttpResponse.json(lagSakMedBlandetInnhold())),
            ...fellesHandlere(),
        );

        await page.goto(`/sak/${SAKSNUMMER}#Tilbakekreving`);
        await forventOverskrift(page, 'Personoversikt');

        await expect(page.getByRole('tab', { name: 'Tilbakekreving (2)' })).toHaveAttribute(
            'aria-selected',
            'true',
        );
        await expect(
            page.getByRole('heading', { name: 'Aktive tilbakekrevingssaker' }),
        ).toBeVisible();
    });

    test('viser tomtilstander for en sak uten innhold', async ({ page, msw }) => {
        msw.use(
            http.get('*/sak/:saksnummer', () => HttpResponse.json(sak())),
            ...fellesHandlere(),
        );

        await page.goto(`/sak/${SAKSNUMMER}`);
        await forventOverskrift(page, 'Personoversikt');

        await expect(page.getByText('Ingen åpne behandlinger på denne saken')).toBeVisible();

        await page.getByRole('tab', { name: 'Vedtatte behandlinger (0)' }).click();
        await expect(page.getByText('Ingen vedtatte behandlinger på denne saken')).toBeVisible();

        await page.getByRole('tab', { name: 'Tilbakekreving (0)' }).click();
        await expect(
            page.getByText('Fant ingen tilbakekrevingsbehandlinger for denne brukeren'),
        ).toBeVisible();

        await page.getByRole('tab', { name: 'Avsluttede behandlinger (0)' }).click();
        await expect(page.getByText('Ingen avsluttede behandlinger på denne saken')).toBeVisible();
    });
});
