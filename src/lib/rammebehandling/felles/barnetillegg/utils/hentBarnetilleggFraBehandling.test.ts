import { describe, expect, test } from '@jest/globals';
import { hentBarnetilleggForhåndsutfyltForRevurdering } from './hentBarnetilleggFraBehandling';
import { SakProps } from '~/lib/sak/SakTyper';
import { Rammevedtak, VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Periode } from '~/types/Periode';

const barnetillegg = (fraOgMed: string, tilOgMed: string, antallBarn: number) => ({
    antallBarn,
    periode: { fraOgMed, tilOgMed },
});

const rammevedtak = (nummer: number, barnetilleggPerioder: BarnetilleggPeriode[]): Rammevedtak => {
    const vedtaksperiode = {
        fraOgMed: barnetilleggPerioder[0].periode.fraOgMed,
        tilOgMed: barnetilleggPerioder[barnetilleggPerioder.length - 1].periode.tilOgMed,
    };

    return {
        id: `vedtak_${nummer}`,
        behandlingId: `beh_${nummer}`,
        opprettet: '2025-01-01T09:00:00',
        vedtaksdato: '2025-01-01',
        resultat: SøknadsbehandlingResultat.INNVILGELSE,
        opprinneligVedtaksperiode: vedtaksperiode,
        opprinneligInnvilgetPerioder: [vedtaksperiode],
        gjeldendeVedtaksperioder: [vedtaksperiode],
        gjeldendeInnvilgetPerioder: [vedtaksperiode],
        saksbehandler: 'Z123456',
        beslutter: 'Z654321',
        innvilgelsesperioder: null,
        barnetillegg: { perioder: barnetilleggPerioder, begrunnelse: null },
        gjeldendeBarnetilleggPerioder: barnetilleggPerioder,
        erGjeldende: true,
        gyldigeKommandoer: {},
        omgjortGrad: null,
    };
};

const sakMedVedtak = (vedtak: Rammevedtak[]): SakProps => ({
    sakId: 'sak_1',
    saksnummer: '202501011001',
    fnr: '12345678911',
    kanSendeInnHelgForMeldekort: false,
    søknader: [],
    åpneBehandlinger: [],
    rammebehandlinger: [],
    klagebehandlinger: [],
    tilbakekrevinger: [],
    alleRammevedtak: vedtak,
    alleKlagevedtak: [],
    meldekortvedtak: [],
    meldekortbehandlinger: {},
    meldeperiodeKjeder: [],
    tidslinje: { elementer: [] },
    innvilgetTidslinje: {
        elementer: vedtak.map((it) => ({
            rammevedtakId: it.id as VedtakId,
            periode: it.gjeldendeVedtaksperioder[0],
            tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
        })),
    },
    utbetalingstidslinje: [],
});

const innvilgelsesperiode = (periode: Periode): Innvilgelsesperiode => ({
    periode,
    antallDagerPerMeldeperiode: 10,
    internDeltakelseId: 'deltakelse_1',
});

// Restdelen av det opprinnelige vedtaket og det nye forlengelsesvedtaket, med et hull mellom seg.
const sakMedHullMellomToVedtak = () =>
    sakMedVedtak([
        rammevedtak(1, [barnetillegg('2025-01-01', '2025-02-28', 2)]),
        rammevedtak(2, [barnetillegg('2025-06-01', '2025-08-31', 2)]),
    ]);

describe('hentBarnetilleggForhåndsutfyltForRevurdering', () => {
    test('gir ingen barnetillegg når innvilgelsesperioden ligger i hullet mellom to vedtak', () => {
        const barnetilleggPerioder = hentBarnetilleggForhåndsutfyltForRevurdering(
            sakMedHullMellomToVedtak(),
            [innvilgelsesperiode({ fraOgMed: '2025-03-01', tilOgMed: '2025-05-31' })],
        );

        expect(barnetilleggPerioder).toEqual([]);
    });

    test('arver antall barn fra det første vedtaket når innvilgelsesperioden ligger før det', () => {
        const barnetilleggPerioder = hentBarnetilleggForhåndsutfyltForRevurdering(
            sakMedHullMellomToVedtak(),
            [innvilgelsesperiode({ fraOgMed: '2024-11-01', tilOgMed: '2024-12-31' })],
        );

        expect(barnetilleggPerioder).toEqual([
            expect.objectContaining({
                antallBarn: 2,
                periode: { fraOgMed: '2024-11-01', tilOgMed: '2024-12-31' },
            }),
        ]);
    });

    test('arver antall barn fra det siste vedtaket når innvilgelsesperioden ligger etter det', () => {
        const barnetilleggPerioder = hentBarnetilleggForhåndsutfyltForRevurdering(
            sakMedHullMellomToVedtak(),
            [innvilgelsesperiode({ fraOgMed: '2025-10-01', tilOgMed: '2025-11-30' })],
        );

        expect(barnetilleggPerioder).toEqual([
            expect.objectContaining({
                antallBarn: 2,
                periode: { fraOgMed: '2025-10-01', tilOgMed: '2025-11-30' },
            }),
        ]);
    });

    test('hopper bare over innvilgelsesperioden som ligger i et hull', () => {
        const barnetilleggPerioder = hentBarnetilleggForhåndsutfyltForRevurdering(
            sakMedHullMellomToVedtak(),
            [
                innvilgelsesperiode({ fraOgMed: '2025-01-01', tilOgMed: '2025-02-28' }),
                innvilgelsesperiode({ fraOgMed: '2025-03-01', tilOgMed: '2025-05-31' }),
            ],
        );

        expect(barnetilleggPerioder).toEqual([
            expect.objectContaining({
                antallBarn: 2,
                periode: { fraOgMed: '2025-01-01', tilOgMed: '2025-02-28' },
            }),
        ]);
    });

    test('utvider barnetillegget til hele innvilgelsesperioden ved overlapp', () => {
        const barnetilleggPerioder = hentBarnetilleggForhåndsutfyltForRevurdering(
            sakMedHullMellomToVedtak(),
            [innvilgelsesperiode({ fraOgMed: '2025-02-01', tilOgMed: '2025-04-30' })],
        );

        expect(barnetilleggPerioder).toEqual([
            expect.objectContaining({
                antallBarn: 2,
                periode: { fraOgMed: '2025-02-01', tilOgMed: '2025-04-30' },
            }),
        ]);
    });
});
