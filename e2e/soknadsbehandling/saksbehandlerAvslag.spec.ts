import {
    BESLUTTER_IDENT,
    SIDELAST_TIMEOUT,
    expect,
    fellesHandlere,
    forventOverskrift,
    test,
} from '../felles/e2eFelles';
import { søknadsbehandlingIkkeValgt } from '~test/rammebehandling';
import type { OppdaterSøknadsbehandlingDTO } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import {
    Avslagsgrunn,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    behandlingssideUrl,
    lagSøknad,
    lagSøknadsbehandlingBackend,
    personoversiktUrl,
    saksbehandlersKommandoer,
} from './soknadsbehandlingTestUtils';

test.describe('Søknadsbehandling - avslag', () => {
    test('saksbehandler avslår søknaden med avslagsgrunner, lagrer og sender til beslutning', async ({
        page,
        msw,
    }) => {
        const backend = lagSøknadsbehandlingBackend(
            søknadsbehandlingIkkeValgt({
                søknad: lagSøknad(),
                gyldigeKommandoer: saksbehandlersKommandoer,
            }),
            BESLUTTER_IDENT,
        );
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(behandlingssideUrl);
        await expect(
            page.getByRole('heading', { name: 'Vedtak (søknadsbehandling)', level: 1 }),
        ).toBeVisible({ timeout: SIDELAST_TIMEOUT });

        await page.getByRole('radio', { name: 'Avslag' }).check();

        const avslagsgrunner = page.getByRole('group', { name: 'Avslagsgrunner' });
        await avslagsgrunner.getByRole('checkbox', { name: 'Alder' }).check();
        await avslagsgrunner.getByRole('checkbox', { name: 'Fremmet for sent' }).check();

        await page
            .getByRole('textbox', { name: 'Begrunnelse vilkårsvurdering', exact: true })
            .fill('Søknaden er fremmet for sent, og bruker er over aldersgrensen.');
        await page
            .getByRole('textbox', { name: 'Tekst til vedtaksbrev' })
            .fill('Du har ikke rett til tiltakspenger.');

        await page.getByRole('button', { name: 'Lagre' }).click();

        await expect
            .poll(() => backend.kall.oppdater)
            .toEqual([
                {
                    resultat: SøknadsbehandlingResultat.AVSLAG,
                    avslagsgrunner: [Avslagsgrunn.Alder, Avslagsgrunn.FremmetForSent],
                    begrunnelseVilkårsvurdering:
                        'Søknaden er fremmet for sent, og bruker er over aldersgrensen.',
                    fritekstTilVedtaksbrev: 'Du har ikke rett til tiltakspenger.',
                    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
                    prioritering: null,
                    skalSendeVedtaksbrev: true,
                },
            ] satisfies OppdaterSøknadsbehandlingDTO[]);

        // Skjemaet lastes på nytt fra det backend returnerte, og valgene skal være beholdt
        await expect(avslagsgrunner.getByRole('checkbox', { name: 'Alder' })).toBeChecked();
        await expect(
            avslagsgrunner.getByRole('checkbox', { name: 'Fremmet for sent' }),
        ).toBeChecked();
        await expect(
            avslagsgrunner.getByRole('checkbox', { name: 'Institusjonsopphold' }),
        ).not.toBeChecked();

        const sendTilBeslutter = page.getByRole('button', { name: 'Send til beslutter' });
        await expect(sendTilBeslutter).toBeEnabled();
        await sendTilBeslutter.click();

        const dialog = page.getByRole('dialog');
        await dialog.getByRole('button', { name: 'Send til beslutning' }).click();

        await expect(page.getByText('Vedtaket er sendt til beslutning.')).toBeVisible();
        await forventOverskrift(page, 'Personoversikt');
        await expect(page).toHaveURL(new RegExp(`${personoversiktUrl}$`));

        expect(backend.kall.sendTilBeslutning).toBe(1);
        expect(backend.hentBehandling().status).toBe(Rammebehandlingsstatus.KLAR_TIL_BESLUTNING);

        const rad = page.getByRole('row').filter({ hasText: 'Søknadsbehandling' });
        await expect(rad.getByText('Avslag')).toBeVisible();
        await expect(rad.getByText('Klar til beslutning')).toBeVisible();
    });
});
