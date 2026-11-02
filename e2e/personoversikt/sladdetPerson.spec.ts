import { sladdet } from '~test/sladdetVerdi';
import {
    expect,
    fellesHandlere,
    forventOverskrift,
    http,
    HttpResponse,
    lagPersonopplysninger,
    lagSaksbehandler,
    test,
} from '../felles/e2eFelles';
import { lagSakMedBlandetInnhold, SAKSNUMMER } from './personoversiktTestUtils';

const SLADDEBANNER_TEKST =
    'Personopplysninger og fritekster er sladdet for rollen din. Saker kan ellers leses som vanlig.';

test.describe('Personoversikten - sladdet person', () => {
    test('bruker uten fagrolle ser sladdebanner og «[Sladdet]» i stedet for personopplysninger', async ({
        page,
        msw,
    }) => {
        const brukerUtenFagrolle = lagSaksbehandler({
            brukernavn: 'Vera Veileder',
            roller: [],
            sladdes: true,
        });

        const sladdedePersonopplysninger = lagPersonopplysninger({
            fnr: sladdet,
            fødselsdato: sladdet,
            fornavn: sladdet,
            mellomnavn: sladdet,
            etternavn: sladdet,
            dødsdato: sladdet,
        });

        msw.use(
            http.get('*/sak/:saksnummer', () =>
                HttpResponse.json({ ...lagSakMedBlandetInnhold(), fnr: sladdet }),
            ),
            ...fellesHandlere(brukerUtenFagrolle, sladdedePersonopplysninger),
        );

        await page.goto(`/sak/${SAKSNUMMER}`);
        await forventOverskrift(page, 'Personoversikt');

        await expect(page.getByText(SLADDEBANNER_TEKST)).toBeVisible();
        await expect(page.getByRole('link', { name: '[Sladdet]' })).toBeVisible();
        await expect(page.getByText('Ola Nordmann')).toHaveCount(0);
        await expect(page.getByText('12345678911')).toHaveCount(0);

        // Saken kan ellers leses som vanlig
        await expect(page.getByText(`Saksnr:`)).toBeVisible();
        await expect(page.getByRole('tab', { name: 'Åpne behandlinger (4)' })).toBeVisible();
        await expect(page.getByRole('row').filter({ hasText: 'Søknadsbehandling' })).toBeVisible();

        // Uten saksbehandlerrolle kan man ikke opprette noe
        await expect(page.getByRole('button', { name: 'Opprett behandling' })).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Opprett sak' })).toHaveCount(0);

        // Søk på fnr gir ikke mening når fnr er sladdet
        await expect(page.getByRole('searchbox', { name: 'InternalHeader søk' })).toHaveAttribute(
            'placeholder',
            'Søk på saksnr eller sak-id',
        );
    });

    test('saksbehandler med fagrolle ser personopplysningene og ingen sladdebanner', async ({
        page,
        msw,
    }) => {
        msw.use(
            http.get('*/sak/:saksnummer', () => HttpResponse.json(lagSakMedBlandetInnhold())),
            ...fellesHandlere(),
        );

        await page.goto(`/sak/${SAKSNUMMER}`);
        await forventOverskrift(page, 'Personoversikt');

        await expect(page.getByRole('link', { name: 'Ola Nordmann' })).toBeVisible();
        await expect(page.getByText('12345678911')).toBeVisible();
        await expect(page.getByText(SLADDEBANNER_TEKST)).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Opprett behandling' })).toBeVisible();
        await expect(page.getByRole('searchbox', { name: 'InternalHeader søk' })).toHaveAttribute(
            'placeholder',
            'Søk på fnr eller saksnummer',
        );
    });
});
