import {
    BESLUTTER_IDENT,
    SIDELAST_TIMEOUT,
    expect,
    fellesHandlere,
    forventOverskrift,
    test,
} from '../felles/e2eFelles';
import {
    lagretInnvilgelsesperiode,
    periode,
    søknadsbehandlingInnvilgelse,
} from '~test/rammebehandling';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import {
    behandlingssideUrl,
    lagSøknad,
    lagSøknadsbehandlingBackend,
    personoversiktUrl,
} from './soknadsbehandlingTestUtils';

const ANNEN_SAKSBEHANDLER = 'Z999999';

test.describe('Søknadsbehandling - tildelt en annen saksbehandler', () => {
    test('behandlingen vises skrivebeskyttet', async ({ page, msw }) => {
        const backend = lagSøknadsbehandlingBackend(
            søknadsbehandlingInnvilgelse({
                søknad: lagSøknad(),
                saksbehandler: ANNEN_SAKSBEHANDLER,
                innvilgelsesperioder: [
                    lagretInnvilgelsesperiode(periode('2025-01-01', '2025-03-31')),
                ],
                begrunnelseVilkårsvurdering: ikkeSladdet('Vurdert av en annen saksbehandler.'),
                fritekstTilVedtaksbrev: ikkeSladdet('Du får tiltakspenger.'),
                // Backend gir bare mulighet til å overta behandlingen
                gyldigeKommandoer: [SaksbehandlerBehandlingKommando.OvertaSaksbehandler],
            }),
            BESLUTTER_IDENT,
        );
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(personoversiktUrl);
        await forventOverskrift(page, 'Personoversikt');

        const rad = page.getByRole('row').filter({ hasText: 'Søknadsbehandling' });
        await expect(rad.getByText(ANNEN_SAKSBEHANDLER)).toBeVisible();
        await expect(rad.getByRole('button', { name: 'Fortsett' })).toHaveCount(0);
        await rad.getByRole('button', { name: 'Se behandling' }).click();

        await expect(page).toHaveURL(new RegExp(`${behandlingssideUrl}$`));
        await expect(
            page.getByRole('heading', { name: 'Vedtak (søknadsbehandling)', level: 1 }),
        ).toBeVisible({ timeout: SIDELAST_TIMEOUT });

        await expect(page.getByText(ANNEN_SAKSBEHANDLER).first()).toBeVisible();

        // Det lagrede vises, men kan ikke endres
        await expect(page.getByRole('radio', { name: 'Innvilgelse' })).toBeChecked();
        const begrunnelse = page.getByRole('textbox', {
            name: 'Begrunnelse vilkårsvurdering',
            exact: true,
        });
        await expect(begrunnelse).toHaveValue('Vurdert av en annen saksbehandler.');
        await expect(begrunnelse).not.toBeEditable();
        await expect(
            page.getByRole('textbox', { name: 'Tekst til vedtaksbrev' }),
        ).not.toBeEditable();
        await expect(page.getByRole('textbox', { name: 'Fra og med' }).first()).toHaveValue(
            '01.01.2025',
        );

        await expect(page.getByRole('button', { name: 'Nullstill' })).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Ny periode' })).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Lagre' })).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Send til beslutter' })).toHaveCount(0);

        // Menyen gir mulighet til å overta behandlingen i stedet
        await page.getByRole('button', { name: 'Meny' }).click();
        await expect(page.getByRole('menuitem', { name: /Overta/ })).toBeVisible();
    });
});
