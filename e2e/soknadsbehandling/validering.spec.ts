import {
    BESLUTTER_IDENT,
    SIDELAST_TIMEOUT,
    expect,
    fellesHandlere,
    http,
    HttpResponse,
    test,
} from '../felles/e2eFelles';
import type { Page } from '@playwright/test';
import { søknadsbehandlingIkkeValgt } from '~test/rammebehandling';
import type { OppdaterSøknadsbehandlingDTO } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import {
    Avslagsgrunn,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';
import {
    behandlingssideUrl,
    lagSøknad,
    lagSøknadsbehandlingBackend,
    saksbehandlersKommandoer,
} from './soknadsbehandlingTestUtils';

const lagBackend = () =>
    lagSøknadsbehandlingBackend(
        søknadsbehandlingIkkeValgt({
            søknad: lagSøknad(),
            gyldigeKommandoer: saksbehandlersKommandoer,
        }),
        BESLUTTER_IDENT,
    );

const åpneBehandlingen = async (page: Page) => {
    await page.goto(behandlingssideUrl);
    await expect(
        page.getByRole('heading', { name: 'Vedtak (søknadsbehandling)', level: 1 }),
    ).toBeVisible({ timeout: SIDELAST_TIMEOUT });
};

const forventFeil = async (page: Page, melding: string) => {
    await expect(page.getByRole('heading', { name: 'Feil i behandlingen' })).toBeVisible();
    await expect(page.getByText(melding)).toBeVisible();
};

test.describe('Søknadsbehandling - validering', () => {
    test('kan ikke sende til beslutning uten å ha valgt resultat', async ({ page, msw }) => {
        const backend = lagBackend();
        msw.use(...fellesHandlere(), ...backend.handlere);

        await åpneBehandlingen(page);

        const sendTilBeslutter = page.getByRole('button', { name: 'Send til beslutter' });
        await sendTilBeslutter.click();

        await forventFeil(page, 'Behandlingsresultat mangler');
        await expect(page.getByRole('dialog')).toHaveCount(0);
        await expect(sendTilBeslutter).toBeDisabled();
        expect(backend.kall.sendTilBeslutning).toBe(0);
    });

    test('lagrer ikke et avslag uten avslagsgrunn', async ({ page, msw }) => {
        const backend = lagBackend();
        msw.use(...fellesHandlere(), ...backend.handlere);

        await åpneBehandlingen(page);

        await page.getByRole('radio', { name: 'Avslag' }).check();
        await page.getByRole('button', { name: 'Lagre' }).click();

        await forventFeil(page, 'Avslagsgrunn må velges');
        await expect(page.getByRole('button', { name: 'Send til beslutter' })).toBeDisabled();

        // Når feilen er rettet kan behandlingen lagres
        await page
            .getByRole('group', { name: 'Avslagsgrunner' })
            .getByRole('checkbox', { name: 'Institusjonsopphold' })
            .check();
        await page.getByRole('button', { name: 'Lagre' }).click();

        await expect(page.getByRole('heading', { name: 'Feil i behandlingen' })).toHaveCount(0);
        await expect
            .poll(() => backend.kall.oppdater.map((dto) => dto.resultat))
            .toEqual([SøknadsbehandlingResultat.AVSLAG]);
        expect(backend.kall.oppdater[0]).toMatchObject({
            avslagsgrunner: [Avslagsgrunn.Institusjonsopphold],
        });
    });

    test('lagrer ikke en innvilgelse uten fullstendig innvilgelsesperiode', async ({
        page,
        msw,
    }) => {
        const backend = lagBackend();
        msw.use(...fellesHandlere(), ...backend.handlere);

        await åpneBehandlingen(page);

        await page.getByRole('radio', { name: 'Innvilgelse' }).check();
        await page.getByRole('textbox', { name: 'Fra og med' }).fill('01.02.2025');
        await expect(page.getByText('Velg dato')).toBeVisible();

        await page.getByRole('button', { name: 'Lagre' }).click();

        await forventFeil(page, 'Minst en fullstendig innvilgelsesperiode må være valgt');
        await expect(page.getByRole('button', { name: 'Send til beslutter' })).toBeDisabled();

        // Når perioden er fullstendig lagres den, og det er det eneste lagre-kallet backend har fått
        await page.getByRole('textbox', { name: 'Til og med' }).first().fill('30.04.2025');
        await page.getByRole('button', { name: 'Lagre' }).click();

        await expect(page.getByRole('heading', { name: 'Feil i behandlingen' })).toHaveCount(0);
        await expect.poll(() => backend.kall.oppdater).toHaveLength(1);
        expect(backend.kall.oppdater[0]).toMatchObject({
            resultat: SøknadsbehandlingResultat.INNVILGELSE,
            innvilgelsesperioder: [{ periode: { fraOgMed: '2025-02-01', tilOgMed: '2025-04-30' } }],
        });
    });

    test('krever begrunnelse ved sending til beslutning når begrunnelsen skal journalføres som notat', async ({
        page,
        msw,
    }) => {
        const backend = lagBackend();
        msw.use(...fellesHandlere(), ...backend.handlere);

        await åpneBehandlingen(page);

        await page.getByRole('radio', { name: 'Avslag' }).check();
        await page
            .getByRole('group', { name: 'Avslagsgrunner' })
            .getByRole('checkbox', { name: 'Alder' })
            .check();
        await page.getByRole('checkbox', { name: 'Journalfør begrunnelsen som notat' }).check();

        // Lagring er lov uten begrunnelse, kravet gjelder først ved sending til beslutning
        await page.getByRole('button', { name: 'Lagre' }).click();
        await expect
            .poll(() => backend.kall.oppdater)
            .toEqual([
                {
                    resultat: SøknadsbehandlingResultat.AVSLAG,
                    avslagsgrunner: [Avslagsgrunn.Alder],
                    begrunnelseVilkårsvurdering: null,
                    fritekstTilVedtaksbrev: null,
                    skalJournalføreNotat: { vilkårsvurdering: true, barnetillegg: false },
                    prioritering: null,
                    skalSendeVedtaksbrev: true,
                },
            ] satisfies OppdaterSøknadsbehandlingDTO[]);

        const sendTilBeslutter = page.getByRole('button', { name: 'Send til beslutter' });
        await expect(sendTilBeslutter).toBeEnabled();
        await sendTilBeslutter.click();

        await forventFeil(page, 'Begrunnelsen må være utfylt når notatet skal journalføres');
        await expect(page.getByRole('dialog')).toHaveCount(0);
        expect(backend.kall.sendTilBeslutning).toBe(0);

        // Ulagrede endringer sperrer sending til beslutning
        await page
            .getByRole('textbox', { name: 'Begrunnelse vilkårsvurdering', exact: true })
            .fill('Bruker er over aldersgrensen.');
        await expect(
            page.getByText('Endringer må lagres før behandlingen kan sendes til beslutter'),
        ).toBeVisible();
        await expect(sendTilBeslutter).toBeDisabled();

        await page.getByRole('button', { name: 'Lagre' }).click();
        await expect.poll(() => backend.kall.oppdater).toHaveLength(2);
        expect(backend.kall.oppdater[1].begrunnelseVilkårsvurdering).toBe(
            'Bruker er over aldersgrensen.',
        );

        await expect(sendTilBeslutter).toBeEnabled();
        await sendTilBeslutter.click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Feil i behandlingen' })).toHaveCount(0);
    });

    test('kan ikke sende til beslutning når lagringen feilet', async ({ page, msw }) => {
        // FEIL I PROD-KODEN: `validerOgHentLagringDTO` (useHentBehandlingLagringProps.ts) setter
        // `sisteLagring` før lagre-kallet er gjort. Feiler lagringen regnes skjemaet derfor som lagret
        // (isDirty = false), og "Send til beslutter" blir aktiv selv om endringene aldri nådde backend.
        // Beslutter får da en annen versjon av behandlingen enn den saksbehandler ser.
        test.fail();

        const backend = lagBackend();
        msw.use(
            ...fellesHandlere(),
            http.post('*/sak/:sakId/behandling/:behandlingId/oppdater', () =>
                HttpResponse.json(
                    { melding: 'Noe gikk galt', kode: 'server_feil' },
                    { status: 500 },
                ),
            ),
            ...backend.handlere,
        );

        await åpneBehandlingen(page);

        await page.getByRole('radio', { name: 'Avslag' }).check();
        await page
            .getByRole('group', { name: 'Avslagsgrunner' })
            .getByRole('checkbox', { name: 'Alder' })
            .check();
        await page.getByRole('button', { name: 'Lagre' }).click();

        await expect(page.getByText(/Feil ved lagring: .*\(kode 500\)/)).toBeVisible();
        await expect(page.getByText('Behandlingen er lagret')).toHaveCount(0);

        await expect(page.getByRole('button', { name: 'Send til beslutter' })).toBeDisabled();
    });
});
