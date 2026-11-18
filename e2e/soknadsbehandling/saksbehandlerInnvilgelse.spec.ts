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
    behandlingssideUrl,
    lagSøknadsbehandlingBackend,
    medJobbklubb,
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

        // Det eneste tiltaket er alltid valgt, og forhåndsutfylt med søknadsperioden
        const tiltak = page.getByRole('group', { name: 'Arbeidsmarkedsopplæring' });
        await expect(tiltak.getByRole('checkbox')).toHaveCount(0);
        await expect(tiltak.getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.01.2025');
        await expect(tiltak.getByRole('textbox', { name: 'Til og med' })).toHaveValue('30.06.2025');

        await tiltak.getByRole('textbox', { name: 'Til og med' }).fill('31.03.2025');

        const antallDager = tiltak.getByRole('combobox', { name: 'Dager per meldeperiode' });
        await expect(antallDager).toHaveValue('10');
        await antallDager.selectOption('8');

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
                    innvilgelsesperioder: {
                        tiltak: [
                            {
                                internDeltakelseId: 'deltakelse_1',
                                erReversertOpphør: false,
                                perioder: [
                                    {
                                        periode: {
                                            fraOgMed: tilDato('2025-01-01'),
                                            tilOgMed: tilDato('2025-03-31'),
                                        },
                                    },
                                ],
                            },
                        ],
                        antallDagerPerMeldeperiode: [
                            {
                                periode: {
                                    fraOgMed: tilDato('2025-01-01'),
                                    tilOgMed: tilDato('2025-03-31'),
                                },
                                antallDagerPerMeldeperiode: 8,
                            },
                        ],
                    },
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

    test('saksbehandler innvilger for to overlappende tiltak', async ({ page, msw }) => {
        const backend = lagSøknadsbehandlingBackend(
            medJobbklubb(
                søknadsbehandlingIkkeValgt({
                    søknad: lagSøknad(),
                    gyldigeKommandoer: saksbehandlersKommandoer,
                }),
            ),
            BESLUTTER_IDENT,
        );
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(behandlingssideUrl);
        await expect(
            page.getByRole('heading', { name: 'Vedtak (søknadsbehandling)', level: 1 }),
        ).toBeVisible({ timeout: SIDELAST_TIMEOUT });

        await page.getByRole('radio', { name: 'Innvilgelse' }).check();

        const arbeidsmarkedsopplæring = page.getByRole('group', {
            name: 'Arbeidsmarkedsopplæring',
        });
        const jobbklubb = page.getByRole('group', { name: 'Jobbklubb' });

        await arbeidsmarkedsopplæring.getByRole('checkbox').check();
        await jobbklubb.getByRole('checkbox').check();

        // Med flere tiltak velges antall dager for hver delperiode i tabellen under tiltakene
        await expect(jobbklubb.getByRole('combobox')).toHaveCount(0);
        await expect(arbeidsmarkedsopplæring.getByRole('combobox')).toHaveCount(0);

        const antallDager = (periode: string) =>
            page.getByRole('combobox', { name: `Dager per meldeperiode for ${periode}` });

        // Antall dager forhåndsutfylles med summen av antall dager per uke i deltakelsene som overlapper,
        // maks 10 siden saken ikke kan melde for helg
        await expect(antallDager('01.01.2025 - 28.02.2025')).toHaveValue('10');
        await expect(antallDager('01.03.2025 - 30.06.2025')).toHaveValue('10');
        await expect(page.getByRole('row', { name: /01\.03\.2025 - 30\.06\.2025/ })).toContainText(
            'Arbeidsmarkedsopplæring, Jobbklubb',
        );

        // Jobbklubb innvilges for to perioder, som gir hver sin delperiode
        await jobbklubb.getByRole('textbox', { name: 'Til og med' }).fill('30.04.2025');
        await jobbklubb.getByRole('button', { name: 'Legg til periode' }).click();

        await antallDager('01.01.2025 - 28.02.2025').selectOption('8');
        await antallDager('01.03.2025 - 30.04.2025').selectOption('12');
        await antallDager('01.05.2025 - 30.06.2025').selectOption('6');

        await page
            .getByRole('textbox', { name: 'Begrunnelse vilkårsvurdering', exact: true })
            .fill('Deltar på to tiltak');
        await page.getByRole('button', { name: 'Lagre' }).click();

        await expect(page.getByText('Behandlingen er lagret')).toBeVisible();
        expect(backend.kall.oppdater).toHaveLength(1);
        expect(backend.kall.oppdater[0]).toMatchObject({
            innvilgelsesperioder: {
                tiltak: [
                    {
                        internDeltakelseId: 'deltakelse_1',
                        erReversertOpphør: false,
                        perioder: [
                            {
                                periode: {
                                    fraOgMed: tilDato('2025-01-01'),
                                    tilOgMed: tilDato('2025-06-30'),
                                },
                            },
                        ],
                    },
                    {
                        internDeltakelseId: 'deltakelse_2',
                        erReversertOpphør: false,
                        perioder: [
                            {
                                periode: {
                                    fraOgMed: tilDato('2025-03-01'),
                                    tilOgMed: tilDato('2025-04-30'),
                                },
                            },
                            {
                                periode: {
                                    fraOgMed: tilDato('2025-05-01'),
                                    tilOgMed: tilDato('2025-06-30'),
                                },
                            },
                        ],
                    },
                ],
                antallDagerPerMeldeperiode: [
                    {
                        periode: {
                            fraOgMed: tilDato('2025-01-01'),
                            tilOgMed: tilDato('2025-02-28'),
                        },
                        antallDagerPerMeldeperiode: 8,
                    },
                    {
                        periode: {
                            fraOgMed: tilDato('2025-03-01'),
                            tilOgMed: tilDato('2025-04-30'),
                        },
                        antallDagerPerMeldeperiode: 12,
                    },
                    {
                        periode: {
                            fraOgMed: tilDato('2025-05-01'),
                            tilOgMed: tilDato('2025-06-30'),
                        },
                        antallDagerPerMeldeperiode: 6,
                    },
                ],
            },
        } satisfies Partial<OppdaterSøknadsbehandlingDTO>);

        // Skjemaet lastes på nytt fra den lagrede behandlingen, og begge tiltakene er fortsatt valgt
        await expect(arbeidsmarkedsopplæring.getByRole('checkbox')).toBeChecked();
        await expect(jobbklubb.getByRole('textbox', { name: 'Fra og med' })).toHaveCount(2);
        await expect(antallDager('01.03.2025 - 30.04.2025')).toHaveValue('12');
    });
});
