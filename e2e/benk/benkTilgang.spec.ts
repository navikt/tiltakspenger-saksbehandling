import type { BenkRequestBody } from '~/lib/benk/typer/felles';
import type { BenkResponsUtenTilgang } from '~/lib/benk/typer/respons';
import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import {
    expect,
    fellesHandlere,
    http,
    HttpResponse,
    lagSaksbehandler,
    SIDELAST_TIMEOUT,
    test,
} from '../felles/e2eFelles';

const utenTilgang: BenkResponsUtenTilgang = { harTilgang: false };

test.describe('Benken - uten tilgang', () => {
    test('saksbehandler uten tilgang til benken får beskjed og kan fortsatt søke', async ({
        page,
        msw,
    }) => {
        const benkKall: BenkRequestBody[] = [];

        msw.use(
            http.post('*/benk/soknader', async ({ request }) => {
                benkKall.push((await request.json()) as BenkRequestBody);
                return HttpResponse.json(utenTilgang);
            }),
            ...fellesHandlere(
                lagSaksbehandler({ roller: [SaksbehandlerRolle.VEILEDER], kanSeBenken: false }),
            ),
        );

        await page.goto('/');

        await expect(page.getByText('Ingen tilgang')).toBeVisible({ timeout: SIDELAST_TIMEOUT });
        await expect(
            page.getByText(
                'Brukeren din har ikke en rolle som tillater å vise oversikten over alle behandlinger.',
            ),
        ).toBeVisible();
        await expect(
            page.getByText('Du kan bruke søket for å slå opp en spesifikk bruker.'),
        ).toBeVisible();

        await expect(
            page.getByRole('heading', { name: 'Oversikt over åpne behandlinger' }),
        ).toHaveCount(0);
        await expect(page.getByRole('tab')).toHaveCount(0);
        await expect(page.getByRole('searchbox', { name: 'InternalHeader søk' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Opprett sak' })).toHaveCount(0);

        expect(benkKall).toHaveLength(1);
    });

    test('uten tilgang settes ingen benk-cookie, så lagrede valg gjenopprettes ikke', async ({
        page,
        msw,
    }) => {
        msw.use(
            http.post('*/benk/:fane', () => HttpResponse.json(utenTilgang)),
            ...fellesHandlere(lagSaksbehandler({ roller: [], kanSeBenken: false })),
        );

        await page.goto('/?tab=REVURDERINGER');
        await expect(page.getByText('Ingen tilgang')).toBeVisible({ timeout: SIDELAST_TIMEOUT });

        const cookies = await page.context().cookies();
        expect(cookies.map((cookie) => cookie.name)).not.toContain('benkFiltersV2');
    });
});
