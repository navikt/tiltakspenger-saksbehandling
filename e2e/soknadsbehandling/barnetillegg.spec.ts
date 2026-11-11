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
import { BarnetilleggBarnKilde } from '~/lib/rammebehandling/typer/Barnetillegg';

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

        // Barnet fra søknaden er forhåndsvalgt, med hele innvilgelsesperioden
        const barnet = page.getByRole('checkbox', { name: /Barn Barnesen/ });
        await expect(barnet).toBeChecked();
        await expect(page.getByRole('radio', { name: 'Hele innvilgelsesperioden' })).toBeChecked();
        await expect(
            page.getByText('Gir barnetillegg i perioden: 01.01.2025 - 31.03.2025'),
        ).toBeVisible();

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
                        barn: [
                            {
                                fnr: null,
                                fornavn: 'Barn',
                                mellomnavn: null,
                                etternavn: 'Barnesen',
                                fødselsdato: tilDato('2015-05-01'),
                                kilde: BarnetilleggBarnKilde.SØKNAD,
                                søknadId: 'soknad_1',
                                perioder: null,
                            },
                        ],
                    },
                    skalSendeVedtaksbrev: true,
                },
            ] satisfies OppdaterSøknadsbehandlingDTO[]);

        // Etter lagring vises det backend returnerte, med barnetillegget beholdt
        await expect(skalInnvilgeBarnetillegg.getByRole('radio', { name: 'Ja' })).toBeChecked();
        await expect(page.getByRole('checkbox', { name: /Barn Barnesen/ })).toBeChecked();
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
        await expect(page.getByRole('checkbox', { name: /Barn Barnesen/ })).toHaveCount(0);

        await page.getByRole('button', { name: 'Lagre' }).click();

        await expect.poll(() => backend.kall.oppdater).toHaveLength(1);
        expect(backend.kall.oppdater[0]).toMatchObject({
            resultat: SøknadsbehandlingResultat.INNVILGELSE,
            barnetillegg: { begrunnelse: null, barn: [] },
        });

        // Advarselen vises før sending til beslutning, men stopper den ikke
        await page.getByRole('button', { name: 'Send til beslutter' }).click();

        const dialog = page.getByRole('dialog');
        await expect(dialog.getByRole('heading', { name: 'Advarsel' })).toBeVisible();
        await expect(
            dialog.getByText(
                'Det er søkt om barnetillegg, men barnetillegg er ikke innvilget - Barn fra søknaden med rett i innvilgelsesperioden: Barn Barnesen (født 01.05.2015)',
            ),
        ).toBeVisible();
        await dialog.getByRole('button', { name: 'Send til beslutning' }).click();

        await expect(page.getByText('Vedtaket er sendt til beslutning.')).toBeVisible();
        expect(backend.kall.sendTilBeslutning).toBe(1);
    });

    test('saksbehandler kan legge til et barn og velge egne perioder for barnet', async ({
        page,
        msw,
    }) => {
        const backend = lagBackendMedBarnISøknaden();
        msw.use(...fellesHandlere(), ...backend.handlere);

        await velgInnvilgelseForFørsteKvartal(page);

        await page.getByRole('button', { name: 'Legg til barn' }).click();
        await page.getByRole('textbox', { name: 'Fornavn' }).fill('Nytt');
        await page.getByRole('textbox', { name: 'Etternavn' }).fill('Barnesen');
        await page.getByRole('textbox', { name: 'Fødselsdato' }).fill('15.02.2025');
        // Tegn som ikke er siffer fjernes, mens ledende 0 beholdes
        await page
            .getByRole('textbox', { name: 'Fødselsnummer (valgfritt)' })
            .fill('0 502a25-12345');
        await expect(page.getByRole('textbox', { name: 'Fødselsnummer (valgfritt)' })).toHaveValue(
            '05022512345',
        );
        await page.getByRole('button', { name: 'Legg til', exact: true }).click();

        // Barnet er født i innvilgelsesperioden, og gir barnetillegg fra fødselsdatoen
        await expect(page.getByRole('checkbox', { name: /Nytt Barnesen/ })).toBeChecked();
        await expect(
            page.getByText('Gir barnetillegg i perioden: 15.02.2025 - 31.03.2025'),
        ).toBeVisible();

        await page
            .getByRole('radiogroup', { name: 'Periode med barnetillegg' })
            .nth(1)
            .getByRole('radio', { name: 'Velg perioder' })
            .check();
        await page.getByRole('textbox', { name: 'Fra og med' }).nth(1).fill('01.03.2025');
        await expect(
            page.getByText('Gir barnetillegg i perioden: 01.03.2025 - 31.03.2025'),
        ).toBeVisible();

        // Barnet kan få flere perioder med opphold mellom
        await page.getByRole('textbox', { name: 'Til og med' }).nth(1).fill('10.03.2025');
        await page.getByRole('button', { name: 'Legg til periode' }).click();
        await page.getByRole('textbox', { name: 'Fra og med' }).nth(2).fill('20.03.2025');
        await expect(
            page.getByText(
                'Gir barnetillegg i periodene: 01.03.2025 - 10.03.2025, 20.03.2025 - 31.03.2025',
            ),
        ).toBeVisible();

        await page.getByRole('button', { name: 'Lagre' }).click();

        await expect.poll(() => backend.kall.oppdater).toHaveLength(1);
        expect(backend.kall.oppdater[0]).toMatchObject({
            barnetillegg: {
                barn: [
                    {
                        fornavn: 'Barn',
                        kilde: BarnetilleggBarnKilde.SØKNAD,
                        perioder: null,
                    },
                    {
                        fnr: '05022512345',
                        fornavn: 'Nytt',
                        mellomnavn: null,
                        etternavn: 'Barnesen',
                        fødselsdato: tilDato('2025-02-15'),
                        kilde: BarnetilleggBarnKilde.SAKSBEHANDLER,
                        søknadId: null,
                        perioder: [
                            {
                                fraOgMed: tilDato('2025-03-01'),
                                tilOgMed: tilDato('2025-03-10'),
                            },
                            {
                                fraOgMed: tilDato('2025-03-20'),
                                tilOgMed: tilDato('2025-03-31'),
                            },
                        ],
                    },
                ],
            },
        });

        // Etter lagring vises barna backend returnerte
        await expect(page.getByRole('checkbox', { name: /Barn Barnesen/ })).toBeChecked();
        await expect(page.getByRole('checkbox', { name: /Nytt Barnesen/ })).toBeChecked();
    });
});
