import {
    expect,
    fellesHandlere,
    forventOverskrift,
    SAKSBEHANDLER_IDENT,
    test,
} from '../felles/e2eFelles';
import { Rammebehandlingsstatus } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    HjemmelForOpphør,
    RevurderingResultat,
    type OppdaterOmgjøringInnvilgelseDTO,
    type OppdaterOmgjøringOpphørDTO,
    type StartRevurderingDTO,
} from '~/lib/rammebehandling/typer/Revurdering';
import {
    behandlingUrl,
    lagFalskBackend,
    personoversiktUrl,
    REVURDERING_ID,
    VEDTAK_ID,
} from './revurderingTestUtils';
import { omgjøringIkkeValgt, periode, tiltaksdeltakelse } from '~test/rammebehandling';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { tilDato } from '~/types/DatoTid';

test.describe('Omgjøring', () => {
    test('kalenderen tillater å forlenge vedtaksperioden til neste år ved innvilgelse, men ikke ved opphør', async ({
        page,
        msw,
    }) => {
        await page.clock.setFixedTime(new Date('2025-11-03T12:00:00'));
        const behandling = omgjøringIkkeValgt({
            id: REVURDERING_ID,
            saksbehandler: SAKSBEHANDLER_IDENT,
            gyldigeKommandoer: [SaksbehandlerBehandlingKommando.Saksbehandle],
        });
        const deltakelsesperiode = periode('2025-01-01', '2026-03-31');
        behandling.saksopplysninger.tiltaksdeltagelse = [
            tiltaksdeltakelse('deltakelse_1', deltakelsesperiode),
        ];
        behandling.innvilgbarePerioder = [
            { internDeltakelseId: 'deltakelse_1', periode: deltakelsesperiode },
        ];
        const backend = lagFalskBackend(behandling);
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(behandlingUrl);
        await forventOverskrift(page, 'Omgjøring');
        await page.getByRole('radio', { name: 'Innvilgelse' }).check();
        await page.getByRole('button', { name: 'Fyll inn periode' }).click();

        await page
            .getByRole('button', { name: /Åpne datovelger/ })
            .nth(1)
            .click();
        const kalender = page.getByRole('dialog');
        await kalender.getByRole('combobox', { name: /år/i }).selectOption('2026');
        await kalender.getByRole('combobox', { name: /måned/i }).selectOption('0');
        await kalender.getByRole('button', { name: 'torsdag 15', exact: true }).click();
        await expect(page.getByRole('textbox', { name: 'Til og med' }).first()).toHaveValue(
            '15.01.2026',
        );

        await page.getByRole('radio', { name: 'Opphør' }).check();
        await page
            .getByRole('button', { name: /Åpne datovelger/ })
            .nth(1)
            .click();
        await expect(
            kalender.getByRole('combobox', { name: /år/i }).getByRole('option', { name: '2026' }),
        ).toHaveCount(0);
    });

    test('saksbehandler omgjør et vedtak til opphør fra vedtatte behandlinger og sender til beslutning', async ({
        page,
        msw,
    }) => {
        const backend = lagFalskBackend();
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(personoversiktUrl);
        await forventOverskrift(page, 'Personoversikt');

        // 1. Start omgjøring av det innvilgede vedtaket fra fanen med vedtatte behandlinger
        await page.getByRole('tab', { name: /^Vedtatte behandlinger/ }).click();
        await page.getByRole('button', { name: 'Meny' }).click();
        await page.getByRole('menuitem', { name: 'Omgjør' }).click();

        await expect(page).toHaveURL(behandlingUrl, { timeout: 30_000 });
        await forventOverskrift(page, 'Omgjøring');
        expect(backend.tilstand.startBodies).toEqual([
            {
                revurderingType: RevurderingResultat.OMGJØRING,
                rammevedtakIdSomOmgjøres: VEDTAK_ID,
            } satisfies StartRevurderingDTO,
        ]);
        await expect(page.getByText(/^Omgjør vedtak med dato/)).toBeVisible();
        await expect(page.getByRole('link', { name: 'Se opprinnelig vedtak' })).toBeVisible();

        // 2. Velg opphør. Perioden forhåndsutfylles med perioden til vedtaket som omgjøres.
        await page.getByRole('radio', { name: 'Opphør' }).check();

        await expect(page.getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.01.2025');
        await expect(page.getByRole('textbox', { name: 'Til og med' })).toHaveValue('31.03.2025');

        // Opphører fra og med februar
        await page.getByRole('textbox', { name: 'Fra og med' }).fill('01.02.2025');
        await page
            .getByLabel('Hjemmel for opphør')
            .selectOption({ label: 'Ingen deltakelse - tiltakspengeforskriften § 2' });
        await page
            .getByRole('textbox', { name: 'Begrunnelse vilkårsvurdering' })
            .fill('Har ikke deltatt siden februar');
        await expect(page.getByRole('heading', { name: 'Vedtaksbrev for opphør' })).toBeVisible();
        await page
            .getByRole('textbox', { name: 'Tekst til vedtaksbrev' })
            .fill('Du har ikke deltatt');

        // 3. Lagre
        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        await expect
            .poll(() => backend.tilstand.oppdaterBodies)
            .toEqual([
                {
                    resultat: RevurderingResultat.OMGJØRING_OPPHØR,
                    begrunnelseVilkårsvurdering: 'Har ikke deltatt siden februar',
                    fritekstTilVedtaksbrev: 'Du har ikke deltatt',
                    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
                    prioritering: null,
                    vedtaksperiode: {
                        fraOgMed: tilDato('2025-02-01'),
                        tilOgMed: tilDato('2025-03-31'),
                    },
                    valgteHjemler: [HjemmelForOpphør.DeltarIkkePåArbeidsmarkedstiltak],
                    skalSendeVedtaksbrev: true,
                } satisfies OppdaterOmgjøringOpphørDTO,
            ]);
        await expect(page.getByText('Behandlingen er lagret')).toBeVisible();
        await expect(page.getByRole('radio', { name: 'Opphør' })).toBeChecked();
        await expect(page.getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.02.2025');

        // 4. Send til beslutning
        await page.getByRole('button', { name: 'Send til beslutter' }).click();
        await page.getByRole('button', { name: 'Send til beslutning' }).click();

        await expect(page).toHaveURL(personoversiktUrl, { timeout: 30_000 });
        await expect(page.getByText('Vedtaket er sendt til beslutning.')).toBeVisible();
        expect(backend.tilstand.antallSendTilBeslutning).toBe(1);
        expect(backend.tilstand.revurdering?.status).toBe(
            Rammebehandlingsstatus.KLAR_TIL_BESLUTNING,
        );
    });

    test('saksbehandler starter omgjøring fra menyen, innvilger med færre dager og sender til beslutning', async ({
        page,
        msw,
    }) => {
        const backend = lagFalskBackend();
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(personoversiktUrl);
        await forventOverskrift(page, 'Personoversikt');

        // 1. Start omgjøring fra «Opprett behandling»-menyen, uten valgt vedtak
        await page.getByRole('button', { name: 'Opprett behandling' }).click();
        await page.getByRole('menuitem', { name: 'Opprett revurdering' }).click();
        const modal = page.getByRole('dialog', { name: 'Start revurdering' });
        await modal.getByRole('radio', { name: 'Omgjøring' }).check();
        await modal.getByRole('button', { name: 'Opprett revurdering (Omgjøring)' }).click();

        await expect(page).toHaveURL(behandlingUrl, { timeout: 30_000 });
        await forventOverskrift(page, 'Omgjøring');
        expect(backend.tilstand.startBodies).toEqual([
            {
                revurderingType: RevurderingResultat.OMGJØRING,
                rammevedtakIdSomOmgjøres: null,
            } satisfies StartRevurderingDTO,
        ]);
        await expect(
            page.getByText('Vedtakene som omgjøres bestemmes av vedtaksperioden du velger.'),
        ).toBeVisible();

        // 2. Velg innvilgelse og vedtaksperioden som omgjøres
        await page.getByRole('radio', { name: 'Innvilgelse' }).check();
        await expect(
            page.getByRole('heading', { name: 'Vedtaksperiode', exact: true }),
        ).toBeVisible();
        await page.getByRole('button', { name: 'Fyll inn periode' }).click();

        // Vedtaksperioden står før innvilgelsesperioden, og begge har feltene «Fra og med» og «Til og med»
        const fraOgMed = page.getByRole('textbox', { name: 'Fra og med' });
        const tilOgMed = page.getByRole('textbox', { name: 'Til og med' });
        await expect(fraOgMed.first()).toHaveValue('01.01.2025');
        await expect(tilOgMed.first()).toHaveValue('31.03.2025');

        // 3. Innvilg hele perioden, men med 8 dager per meldeperiode
        await expect(page.getByRole('heading', { name: 'Innvilgelsesperioder' })).toBeVisible();
        await fraOgMed.last().fill('01.01.2025');
        await tilOgMed.last().fill('31.03.2025');
        await page.getByLabel('Antall dager').selectOption('8');

        await page
            .getByRole('textbox', { name: 'Begrunnelse vilkårsvurdering' })
            .fill('Deltar bare fire dager i uka');
        await expect(
            page.getByRole('heading', { name: 'Vedtaksbrev for revurdering av innvilgelse' }),
        ).toBeVisible();
        await page.getByRole('textbox', { name: 'Tekst til vedtaksbrev' }).fill('Færre dager');

        // 4. Lagre
        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        await expect
            .poll(() => backend.tilstand.oppdaterBodies)
            .toEqual([
                {
                    resultat: RevurderingResultat.OMGJØRING,
                    begrunnelseVilkårsvurdering: 'Deltar bare fire dager i uka',
                    fritekstTilVedtaksbrev: 'Færre dager',
                    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
                    prioritering: null,
                    vedtaksperiode: {
                        fraOgMed: tilDato('2025-01-01'),
                        tilOgMed: tilDato('2025-03-31'),
                    },
                    innvilgelsesperioder: [
                        {
                            periode: {
                                fraOgMed: tilDato('2025-01-01'),
                                tilOgMed: tilDato('2025-03-31'),
                            },
                            antallDagerPerMeldeperiode: 8,
                            internDeltakelseId: 'deltakelse_1',
                        },
                    ],
                    barnetillegg: { begrunnelse: null, perioder: [] },
                    skalSendeVedtaksbrev: true,
                } satisfies OppdaterOmgjøringInnvilgelseDTO,
            ]);
        await expect(page.getByText('Behandlingen er lagret')).toBeVisible();
        await expect(page.getByLabel('Antall dager')).toHaveValue('8');

        // 5. Send til beslutning
        await page.getByRole('button', { name: 'Send til beslutter' }).click();
        await page.getByRole('button', { name: 'Send til beslutning' }).click();

        await expect(page).toHaveURL(personoversiktUrl, { timeout: 30_000 });
        await expect(page.getByText('Vedtaket er sendt til beslutning.')).toBeVisible();
        expect(backend.tilstand.antallSendTilBeslutning).toBe(1);
    });
});
