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
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    lagSøknad,
    lagSøknadsbehandlingBackend,
    personoversiktUrl,
    saksbehandlersKommandoer,
} from './soknadsbehandlingTestUtils';
import { tilDato } from '~/types/DatoTid';

test.describe('Søknadsbehandling - innvilgelse', () => {
    test('saksbehandler innvilger søknaden, lagrer og sender til beslutning', async ({
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

        await page.goto(personoversiktUrl);
        await forventOverskrift(page, 'Personoversikt');

        const åpneBehandlinger = page.getByRole('table').filter({ hasText: 'Søknadsbehandling' });
        await expect(åpneBehandlinger.getByText('Under behandling')).toBeVisible();
        await åpneBehandlinger.getByRole('button', { name: 'Fortsett' }).click();

        await expect(
            page.getByRole('heading', { name: 'Vedtak (søknadsbehandling)', level: 1 }),
        ).toBeVisible({ timeout: SIDELAST_TIMEOUT });

        await page.getByRole('radio', { name: 'Innvilgelse' }).check();

        await page.getByRole('textbox', { name: 'Fra og med' }).fill('01.01.2025');
        await page.getByRole('textbox', { name: 'Til og med' }).fill('31.03.2025');

        // Når perioden er valgt fylles resten av innvilgelsesperioden ut automatisk
        const antallDager = page.getByRole('combobox', { name: 'Antall dager' });
        await expect(antallDager).toHaveValue('10');
        await antallDager.selectOption('8');
        await expect(page.getByRole('combobox', { name: 'Tiltak' })).toHaveValue('deltakelse_1');

        await expect(page.getByRole('radio', { name: 'Nei' })).toBeChecked();

        await page
            .getByRole('textbox', { name: 'Begrunnelse vilkårsvurdering', exact: true })
            .fill('  Bruker oppfyller vilkårene for tiltakspenger.  ');
        await page.getByRole('checkbox', { name: 'Journalfør begrunnelsen som notat' }).check();
        await page
            .getByRole('textbox', { name: 'Tekst til vedtaksbrev' })
            .fill('Du får tiltakspenger mens du deltar på tiltaket.');

        const sendTilBeslutter = page.getByRole('button', { name: 'Send til beslutter' });
        await expect(
            page.getByText('Endringer må lagres før behandlingen kan sendes til beslutter'),
        ).toBeVisible();
        await expect(sendTilBeslutter).toBeDisabled();

        await page.getByRole('button', { name: 'Lagre' }).click();

        await expect(page.getByText('Behandlingen er lagret')).toBeVisible();
        await expect
            .poll(() => backend.kall.oppdater)
            .toEqual([
                {
                    resultat: SøknadsbehandlingResultat.INNVILGELSE,
                    begrunnelseVilkårsvurdering: 'Bruker oppfyller vilkårene for tiltakspenger.',
                    fritekstTilVedtaksbrev: 'Du får tiltakspenger mens du deltar på tiltaket.',
                    skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: false },
                    prioritering: null,
                    innvilgelsesperioder: [
                        {
                            periode: {
                                fraOgMed: tilDato('2025-01-01'),
                                tilOgMed: tilDato('2025-03-31'),
                            },
                            antallDagerPerMeldeperiode: 8,
                            internDeltakelseId: 'deltakelse_1',
                            erReversertOpphør: false,
                        },
                    ],
                    barnetillegg: { begrunnelse: null, barn: [] },
                    skalSendeVedtaksbrev: true,
                },
            ] satisfies OppdaterSøknadsbehandlingDTO[]);

        await expect(sendTilBeslutter).toBeEnabled();
        await sendTilBeslutter.click();

        const dialog = page.getByRole('dialog');
        await expect(dialog.getByText('Send vedtaket til beslutning?')).toBeVisible();
        await dialog.getByRole('button', { name: 'Send til beslutning' }).click();

        await expect(page.getByText('Vedtaket er sendt til beslutning.')).toBeVisible();
        await forventOverskrift(page, 'Personoversikt');
        await expect(page).toHaveURL(new RegExp(`${personoversiktUrl}$`));

        expect(backend.kall.sendTilBeslutning).toBe(1);
        expect(backend.hentBehandling().status).toBe(Rammebehandlingsstatus.KLAR_TIL_BESLUTNING);

        await expect(åpneBehandlinger.getByText('Klar til beslutning')).toBeVisible();
        await expect(åpneBehandlinger.getByRole('button', { name: 'Se behandling' })).toBeVisible();
    });
});
