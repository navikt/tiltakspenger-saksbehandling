import { expect, fellesHandlere, forventOverskrift, test } from '../felles/e2eFelles';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import {
    behandlingUrl,
    lagFalskBackend,
    lagStartetRevurdering,
    VEDTAK_ID,
} from './revurderingTestUtils';

test.describe('Validering av revurdering', () => {
    test('stans uten hjemmel og dato kan verken lagres eller sendes til beslutning', async ({
        page,
        msw,
    }) => {
        const backend = lagFalskBackend(
            lagStartetRevurdering({
                revurderingType: RevurderingResultat.STANS,
                rammevedtakIdSomOmgjøres: null,
            }),
        );
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(behandlingUrl);
        await forventOverskrift(page, 'Revurdering til stans av tiltakspenger');

        const feil = page.getByText('Feil i behandlingen');
        const sendTilBeslutter = page.getByRole('button', { name: 'Send til beslutter' });
        const hjemmelFeil = page.getByText(
            'Du må velge en hjemmel som begrunnelse for hvorfor tiltakspengene stanses.',
        );
        const datoFeil = page.getByText(
            'Du må velge en fra-dato for når tiltakspengene skal stanses.',
        );

        // Send til beslutning viser feilene i stedet for å åpne bekreftelsesdialogen
        await expect(feil).toHaveCount(0);
        await sendTilBeslutter.click();

        await expect(feil).toBeVisible();
        await expect(hjemmelFeil).toBeVisible();
        await expect(datoFeil).toBeVisible();
        await expect(page.getByRole('dialog')).toHaveCount(0);
        await expect(sendTilBeslutter).toBeDisabled();

        // Lagring stoppes også av valideringen
        await page.getByRole('button', { name: 'Lagre', exact: true }).click();
        await expect(hjemmelFeil).toBeVisible();

        // Når feltene er fylt ut, lagres behandlingen og feilene forsvinner
        await page
            .getByLabel('Hjemmel for stans')
            .selectOption({ label: 'Ingen deltakelse - tiltakspengeforskriften § 2' });
        await page.getByRole('textbox', { name: 'Stans fra og med' }).fill('01.03.2025');
        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        await expect.poll(() => backend.tilstand.oppdaterBodies).toHaveLength(1);
        await expect(page.getByText('Behandlingen er lagret')).toBeVisible();
        await expect(feil).toHaveCount(0);

        // Notatet kan ikke journalføres uten begrunnelse
        await page.getByRole('checkbox', { name: 'Journalfør begrunnelsen som notat' }).check();
        await page.getByRole('button', { name: 'Lagre', exact: true }).click();
        await expect.poll(() => backend.tilstand.oppdaterBodies).toHaveLength(2);
        await expect(page.getByText('Behandlingen er lagret')).toBeVisible();

        await sendTilBeslutter.click();
        await expect(
            page.getByText('Begrunnelsen må være utfylt når notatet skal journalføres'),
        ).toBeVisible();
        await expect(page.getByRole('dialog')).toHaveCount(0);

        expect(backend.tilstand.antallSendTilBeslutning).toBe(0);
    });

    test('revurdering av innvilgelse uten innvilgelsesperiode kan ikke sendes til beslutning', async ({
        page,
        msw,
    }) => {
        const backend = lagFalskBackend(
            lagStartetRevurdering({
                revurderingType: RevurderingResultat.INNVILGELSE,
                rammevedtakIdSomOmgjøres: null,
            }),
        );
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(behandlingUrl);
        await forventOverskrift(page, 'Revurdering av innvilgelse');

        await page.getByRole('button', { name: 'Send til beslutter' }).click();

        await expect(page.getByText('Feil i behandlingen')).toBeVisible();
        await expect(
            page.getByText('Minst en fullstendig innvilgelsesperiode må være valgt'),
        ).toBeVisible();
        await expect(page.getByRole('dialog')).toHaveCount(0);

        await page.getByRole('button', { name: 'Lagre', exact: true }).click();
        await expect(
            page.getByText('Minst en fullstendig innvilgelsesperiode må være valgt'),
        ).toBeVisible();

        expect(backend.tilstand.oppdaterBodies).toEqual([]);
        expect(backend.tilstand.antallSendTilBeslutning).toBe(0);
    });

    test('opphør uten hjemmel kan ikke lagres', async ({ page, msw }) => {
        const backend = lagFalskBackend(
            lagStartetRevurdering({
                revurderingType: RevurderingResultat.OMGJØRING,
                rammevedtakIdSomOmgjøres: VEDTAK_ID,
            }),
        );
        msw.use(...fellesHandlere(), ...backend.handlere);

        await page.goto(behandlingUrl);
        await forventOverskrift(page, 'Omgjøring');

        await page.getByRole('radio', { name: 'Opphør' }).check();
        await expect(page.getByLabel('Hjemmel for opphør')).toBeVisible();

        await page.getByRole('button', { name: 'Lagre', exact: true }).click();

        await expect(page.getByText('Feil i behandlingen')).toBeVisible();
        await expect(page.getByText('Må velge en hjemmel for opphør')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Send til beslutter' })).toBeDisabled();

        expect(backend.tilstand.oppdaterBodies).toEqual([]);
    });
});
