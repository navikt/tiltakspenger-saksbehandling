import type { Page } from '@playwright/test';
import { BenkTab } from '~/lib/benk/typer/tabs';
import { tilSaksnummer } from '~/lib/sak/Saksnummer';
import { sak } from '~test/rammebehandling';
import {
    expect,
    fellesHandlere,
    forventOverskrift,
    http,
    HttpResponse,
    lagSaksbehandler,
    SIDELAST_TIMEOUT,
    test,
} from '../felles/e2eFelles';
import { lagBenkOversikt, lagBenkRespons } from './benkTestUtils';

const tomBenk = () =>
    http.post('*/benk/soknader', () =>
        HttpResponse.json(lagBenkRespons(BenkTab.SØKNADER, lagBenkOversikt([]))),
    );

const søkefelt = (page: Page) => page.getByRole('searchbox', { name: 'InternalHeader søk' });

test.describe('Interndekoratøren - søk og opprett sak', () => {
    for (const { beskrivelse, søketekst } of [
        { beskrivelse: 'fødselsnummer', søketekst: '12345678911' },
        { beskrivelse: 'saksnummer', søketekst: '202501011001' },
    ]) {
        test(`søk på ${beskrivelse} navigerer til personoversikten`, async ({ page, msw }) => {
            const søkKall: unknown[] = [];

            msw.use(
                tomBenk(),
                http.post('*/sak', async ({ request }) => {
                    søkKall.push(await request.json());
                    return HttpResponse.json(sak());
                }),
                http.get('*/sak/:saksnummer', () => HttpResponse.json(sak())),
                ...fellesHandlere(),
            );

            await page.goto('/');
            await forventOverskrift(page, 'Oversikt over åpne behandlinger');

            await expect(søkefelt(page)).toHaveAttribute(
                'placeholder',
                'Søk på fnr eller saksnummer',
            );
            // Mellomrom fjernes fra søketeksten
            await søkefelt(page).fill(` ${søketekst} `);
            await søkefelt(page).press('Enter');

            await expect(page).toHaveURL(/\/sak\/202501011001$/, { timeout: SIDELAST_TIMEOUT });
            await forventOverskrift(page, 'Personoversikt');
            await expect(page.getByText('Saksnr: 202501011001')).toBeVisible();
            expect(søkKall).toEqual([{ fnr: søketekst }]);
        });
    }

    test('søk uten treff viser feilmelding og blir på siden', async ({ page, msw }) => {
        msw.use(
            tomBenk(),
            http.post('*/sak', () =>
                HttpResponse.json(
                    { melding: 'Fant ikke fødselsnummer', kode: 'fant_ikke_fnr' },
                    { status: 404 },
                ),
            ),
            ...fellesHandlere(),
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await søkefelt(page).fill('10987654321');
        await søkefelt(page).press('Enter');

        await expect(page.getByText('Fant ikke fødselsnummeret')).toBeVisible();
        await expect(page).toHaveURL(/\/$/);
    });

    test('«Opprett sak» validerer fødselsnummeret og navigerer til den nye saken', async ({
        page,
        msw,
    }) => {
        const opprettKall: unknown[] = [];
        const nyttSaksnummer = tilSaksnummer('202601011001');

        msw.use(
            tomBenk(),
            http.put('*/sak', async ({ request }) => {
                opprettKall.push(await request.json());
                return HttpResponse.json({ saksnummer: nyttSaksnummer, opprettet: true });
            }),
            http.get('*/sak/:saksnummer', () =>
                HttpResponse.json(sak({ sakId: 'sak_ny', saksnummer: nyttSaksnummer })),
            ),
            ...fellesHandlere(),
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await page.getByRole('button', { name: 'Opprett sak' }).click();
        const dialog = page.getByRole('dialog', { name: 'Opprett sak' });
        await expect(dialog).toBeVisible();

        await dialog.getByLabel('Fødselsnummer').fill('1234');
        await dialog.getByRole('button', { name: 'Opprett sak' }).click();
        await expect(dialog.getByText('Fødselsnummer må være 11 siffer langt')).toBeVisible();
        expect(opprettKall).toHaveLength(0);

        await dialog.getByLabel('Fødselsnummer').fill('10987654321');
        await expect(dialog.getByText('Fødselsnummer må være 11 siffer langt')).toBeHidden();
        await dialog.getByRole('button', { name: 'Opprett sak' }).click();

        await expect(page).toHaveURL(/\/sak\/202601011001$/, { timeout: SIDELAST_TIMEOUT });
        await forventOverskrift(page, 'Personoversikt');
        expect(opprettKall).toEqual([{ fnr: '10987654321' }]);
    });

    test('feil ved «Opprett sak» vises i dialogen', async ({ page, msw }) => {
        msw.use(
            tomBenk(),
            http.put('*/sak', () =>
                HttpResponse.json(
                    { melding: 'Fant ikke fødselsnummer', kode: 'fant_ikke_fnr' },
                    { status: 404 },
                ),
            ),
            ...fellesHandlere(),
        );

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await page.getByRole('button', { name: 'Opprett sak' }).click();
        const dialog = page.getByRole('dialog', { name: 'Opprett sak' });
        await dialog.getByLabel('Fødselsnummer').fill('10987654321');
        await dialog.getByRole('button', { name: 'Opprett sak' }).click();

        await expect(dialog.getByText('Feil ved opprettelse av sak')).toBeVisible();
        await expect(dialog.getByText('Fant ikke fødselsnummeret')).toBeVisible();
        await expect(page).toHaveURL(/\/$/);
    });

    test('«Opprett sak» vises ikke for brukere uten saksbehandlerrollen', async ({ page, msw }) => {
        msw.use(tomBenk(), ...fellesHandlere(lagSaksbehandler({ roller: [] })));

        await page.goto('/');
        await forventOverskrift(page, 'Oversikt over åpne behandlinger');

        await expect(søkefelt(page)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Opprett sak' })).toHaveCount(0);
    });
});
