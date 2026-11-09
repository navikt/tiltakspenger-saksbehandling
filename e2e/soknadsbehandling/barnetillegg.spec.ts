import {
    BESLUTTER_IDENT,
    SIDELAST_TIMEOUT,
    expect,
    fellesHandlere,
    test,
} from '../felles/e2eFelles';
import type { Page } from '@playwright/test';
import { søknadBarn, søknadsbehandlingIkkeValgt } from '~test/rammebehandling';
import type { OppdaterSøknadsbehandlingDTO } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import {
    behandlingssideUrl,
    lagSøknad,
    lagSøknadsbehandlingBackend,
    saksbehandlersKommandoer,
} from './soknadsbehandlingTestUtils';
import { tilDato } from '~/types/DatoTid';

const lagBackendMedBarnISøknaden = () =>
    lagSøknadsbehandlingBackend(
        søknadsbehandlingIkkeValgt({
            søknad: lagSøknad([søknadBarn('2015-05-01')]),
            gyldigeKommandoer: saksbehandlersKommandoer,
        }),
        BESLUTTER_IDENT,
    );

const velgInnvilgelseForFørsteKvartal = async (page: Page) => {
    await page.goto(behandlingssideUrl);
    await expect(
        page.getByRole('heading', { name: 'Vedtak (søknadsbehandling)', level: 1 }),
    ).toBeVisible({ timeout: SIDELAST_TIMEOUT });

    await page.getByRole('radio', { name: 'Innvilgelse' }).check();
    await page.getByRole('textbox', { name: 'Fra og med' }).fill('01.01.2025');
    await page.getByRole('textbox', { name: 'Til og med' }).fill('31.03.2025');

    await expect(page.getByRole('heading', { name: 'Barnetillegg', exact: true })).toBeVisible();
};

test.describe('Søknadsbehandling - barnetillegg', () => {
    test('barnetillegg fylles ut fra barna i søknaden og lagres', async ({ page, msw }) => {
        const backend = lagBackendMedBarnISøknaden();
        msw.use(...fellesHandlere(), ...backend.handlere);

        await velgInnvilgelseForFørsteKvartal(page);

        const skalInnvilgeBarnetillegg = page.getByRole('radiogroup', {
            name: 'Skal det innvilges barnetillegg?',
        });
        await expect(skalInnvilgeBarnetillegg.getByRole('radio', { name: 'Ja' })).toBeChecked();

        // Barnetilleggsperioden er forhåndsutfylt med innvilgelsesperioden og barnet fra søknaden
        const fraOgMed = page.getByRole('textbox', { name: 'Fra og med' });
        const tilOgMed = page.getByRole('textbox', { name: 'Til og med' });
        await expect(fraOgMed).toHaveCount(2);
        await expect(fraOgMed.nth(1)).toHaveValue('01.01.2025');
        await expect(tilOgMed.nth(1)).toHaveValue('31.03.2025');
        await expect(page.getByRole('combobox', { name: 'Antall barn' })).toHaveValue('1');

        await page
            .getByRole('textbox', { name: 'Begrunnelse vilkårsvurdering', exact: true })
            .fill('Bruker deltar på tiltak og har rett på tiltakspenger.');
        await page
            .getByRole('textbox', { name: 'Begrunnelse vilkårsvurdering barnetillegg' })
            .fill('Bruker forsørger ett barn under 16 år.');
        await page
            .getByRole('checkbox', { name: 'Journalfør begrunnelsen for barnetillegg som notat' })
            .check();
        await page
            .getByRole('textbox', { name: 'Tekst til vedtaksbrev' })
            .fill('Du får barnetillegg for ett barn.');

        await page.getByRole('button', { name: 'Lagre' }).click();

        await expect
            .poll(() => backend.kall.oppdater)
            .toEqual([
                {
                    resultat: SøknadsbehandlingResultat.INNVILGELSE,
                    begrunnelseVilkårsvurdering:
                        'Bruker deltar på tiltak og har rett på tiltakspenger.',
                    fritekstTilVedtaksbrev: 'Du får barnetillegg for ett barn.',
                    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: true },
                    prioritering: null,
                    innvilgelsesperioder: [
                        {
                            periode: {
                                fraOgMed: tilDato('2025-01-01'),
                                tilOgMed: tilDato('2025-03-31'),
                            },
                            antallDagerPerMeldeperiode: 10,
                            internDeltakelseId: 'deltakelse_1',
                            erReversertOpphør: false,
                        },
                    ],
                    barnetillegg: {
                        begrunnelse: 'Bruker forsørger ett barn under 16 år.',
                        perioder: [
                            {
                                antallBarn: 1,
                                periode: {
                                    fraOgMed: tilDato('2025-01-01'),
                                    tilOgMed: tilDato('2025-03-31'),
                                },
                            },
                        ],
                    },
                    skalSendeVedtaksbrev: true,
                },
            ] satisfies OppdaterSøknadsbehandlingDTO[]);

        // Etter lagring vises det backend returnerte, med barnetillegget beholdt
        await expect(skalInnvilgeBarnetillegg.getByRole('radio', { name: 'Ja' })).toBeChecked();
        await expect(page.getByRole('combobox', { name: 'Antall barn' })).toHaveValue('1');
        await expect(page.getByRole('button', { name: 'Send til beslutter' })).toBeEnabled();
    });

    test('advarer når det er søkt om barnetillegg men barnetillegg ikke innvilges', async ({
        page,
        msw,
    }) => {
        const backend = lagBackendMedBarnISøknaden();
        msw.use(...fellesHandlere(), ...backend.handlere);

        await velgInnvilgelseForFørsteKvartal(page);

        await page
            .getByRole('radiogroup', { name: 'Skal det innvilges barnetillegg?' })
            .getByRole('radio', { name: 'Nei' })
            .check();
        await expect(
            page.getByText('Husk å begrunne avslaget på barnetillegg i vedtaksbrevet.'),
        ).toBeVisible();
        await expect(page.getByRole('combobox', { name: 'Antall barn' })).toHaveCount(0);

        await page.getByRole('button', { name: 'Lagre' }).click();

        await expect.poll(() => backend.kall.oppdater).toHaveLength(1);
        expect(backend.kall.oppdater[0]).toMatchObject({
            resultat: SøknadsbehandlingResultat.INNVILGELSE,
            barnetillegg: { begrunnelse: null, perioder: [] },
        });

        // Advarselen vises før sending til beslutning, men stopper den ikke
        await page.getByRole('button', { name: 'Send til beslutter' }).click();

        const dialog = page.getByRole('dialog');
        await expect(dialog.getByRole('heading', { name: 'Advarsel' })).toBeVisible();
        await expect(
            dialog.getByText(
                'Det er søkt om barnetillegg, men barnetillegg er ikke innvilget - Forventet barnetillegg fra søknad: 1 barn i perioden 01.01.2025 - 31.03.2025',
            ),
        ).toBeVisible();
        await dialog.getByRole('button', { name: 'Send til beslutning' }).click();

        await expect(page.getByText('Vedtaket er sendt til beslutning.')).toBeVisible();
        expect(backend.kall.sendTilBeslutning).toBe(1);
    });
});
