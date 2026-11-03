/** @jest-environment jsdom */
import '@testing-library/jest-dom/jest-globals';
import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { BeregningOgSimuleringHeader } from '~/lib/beregning-og-simulering/header/BeregningOgSimuleringHeader';
import {
    SimuleringResultat,
    SimulerteBeløp,
    SimulertBeregning,
    SimulertBeregningPerMeldeperiode,
    SimulerertBehandlingstype,
} from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { BeregningerSummert } from '~/lib/beregning-og-simulering/typer/Beregning';
import {
    KanIkkeIverksetteUtbetalingGrunn,
    Utbetalingsstatus,
} from '~/lib/_felles/utbetaling/utbetalingTyper';
import { MeldekortbehandlingId } from '~/lib/meldekort/typer/Meldekortbehandling';
import { formatterBeløp } from '~/lib/_felles/utbetaling/beløp/beløpUtils';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { ANDRE_MANDAG, FØRSTE_MANDAG, kjedeIdFor, meldeperiodeDatoer } from '~test/meldekort';
import { Dato, tilDato, tilTidspunkt } from '~/types/DatoTid';

const NEGATIV_UTEN_FEILUTBETALING =
    /Beregningen viser negativt endret beløp, men simulering viser ingen feilutbetaling/;

// Testing Library normaliserer mellomrom i DOM-teksten, mens Intl bruker hardt mellomrom
const beløpTekst = (beløp: number) => formatterBeløp(beløp).replace(/\s/g, ' ');

const beregning = (før: number | null, nå: number): BeregningerSummert => ({
    totalt: { før, nå },
    ordinært: { før, nå },
    barnetillegg: { før: før === null ? null : 0, nå: 0 },
});

const simulertMeldeperiode = (fraOgMed: Dato): SimulertBeregningPerMeldeperiode => ({
    kjedeId: kjedeIdFor(fraOgMed),
    dager: meldeperiodeDatoer(fraOgMed).map((dato) => ({
        dato,
        merker: [],
        status: null,
        beregning: null,
    })),
    simulerteBeløp: null,
    beregning: beregning(null, 0),
    flagg: {
        harJustering: false,
        justeringGårOppINull: false,
        justeringPåTversAvMeldeperiodeEllerMåned: false,
        harFeilutbetaling: false,
        harTrekk: false,
    },
    posteringer: [],
});

const simulerteBeløp = (overstyringer: Partial<SimulerteBeløp> = {}): SimulerteBeløp => ({
    feilutbetaling: 0,
    etterbetaling: 0,
    tidligereUtbetaling: 0,
    nyUtbetaling: 0,
    totalJustering: 0,
    totalTrekk: 0,
    ...overstyringer,
});

const simulertBeregning = (
    sum: BeregningerSummert,
    beløp: SimulerteBeløp | null,
    meldeperiodeStarter: Dato[] = [FØRSTE_MANDAG],
): SimulertBeregning => {
    const felles = {
        behandlingId: 'meldekort_behandling_1' as MeldekortbehandlingId,
        behandlingstype: SimulerertBehandlingstype.MELDERKORT,
        meldeperioder: meldeperiodeStarter.map(simulertMeldeperiode),
        beregningstidspunkt: tilTidspunkt('2025-02-03T10:00:00'),
        beregning: sum,
    };

    return beløp
        ? {
              ...felles,
              simuleringstidspunkt: tilTidspunkt('2025-02-03T10:00:01'),
              simuleringsdato: tilDato('2025-02-03'),
              simuleringTotalBeløp: beløp.nyUtbetaling,
              simulerteBeløp: beløp,
              simuleringResultat: SimuleringResultat.ENDRING,
          }
        : {
              ...felles,
              simuleringstidspunkt: null,
              simuleringsdato: null,
              simuleringTotalBeløp: null,
              simulerteBeløp: null,
              simuleringResultat: SimuleringResultat.IKKE_SIMULERT,
          };
};

const renderHeader = (
    props: Partial<Parameters<typeof BeregningOgSimuleringHeader>[0]> &
        Pick<Parameters<typeof BeregningOgSimuleringHeader>[0], 'simulertBeregning'>,
) =>
    render(
        <BeregningOgSimuleringHeader
            navkontor={ikkeSladdet('0220')}
            navkontorNavn={ikkeSladdet('Nav Asker')}
            kanIkkeIverksetteUtbetaling={null}
            erOmberegning={false}
            {...props}
        />,
    );

describe('BeregningOgSimuleringHeader', () => {
    test('viser beregnet beløp for en første beregning', () => {
        renderHeader({ simulertBeregning: simulertBeregning(beregning(null, 2980), null) });

        expect(screen.getByText('Beregnet beløp')).toBeInTheDocument();
        expect(screen.getByText(beløpTekst(2980))).toBeInTheDocument();
        expect(screen.queryByText(/Vedtaket påvirker beregningen/)).not.toBeInTheDocument();
        expect(screen.queryByText(NEGATIV_UTEN_FEILUTBETALING)).not.toBeInTheDocument();
    });

    test('viser endringen fra forrige beregning og hvilke meldeperioder som påvirkes ved omberegning', () => {
        renderHeader({
            simulertBeregning: simulertBeregning(
                beregning(2980, 3576),
                simulerteBeløp({ etterbetaling: 596 }),
                [FØRSTE_MANDAG, ANDRE_MANDAG],
            ),
            erOmberegning: true,
        });

        expect(screen.getByText('Beregnet endring i utbetalingen')).toBeInTheDocument();
        expect(screen.getByText(beløpTekst(596))).toBeInTheDocument();
        expect(
            screen.getByText(
                'Vedtaket påvirker beregningen av 2 meldeperioder i perioden 06.01.2025 - 02.02.2025',
            ),
        ).toBeInTheDocument();
    });

    test('bruker entall når omberegningen kun påvirker én meldeperiode', () => {
        renderHeader({
            simulertBeregning: simulertBeregning(beregning(2980, 2980), null),
            erOmberegning: true,
        });

        expect(
            screen.getByText(
                'Vedtaket påvirker beregningen av 1 meldeperiode i perioden 06.01.2025 - 19.01.2025',
            ),
        ).toBeInTheDocument();
    });

    test.each([
        {
            simulering: 'simulering uten feilutbetaling',
            beløp: simulerteBeløp({ feilutbetaling: 0 }),
            forventAdvarsel: true,
        },
        { simulering: 'manglende simulering', beløp: null, forventAdvarsel: true },
        {
            simulering: 'simulering med feilutbetaling',
            beløp: simulerteBeløp({ feilutbetaling: 596 }),
            forventAdvarsel: false,
        },
    ])(
        'negativ endring med $simulering gir advarsel=$forventAdvarsel',
        ({ beløp, forventAdvarsel }) => {
            renderHeader({
                simulertBeregning: simulertBeregning(beregning(3576, 2980), beløp),
                erOmberegning: true,
            });

            expect(screen.getByText(beløpTekst(-596))).toBeInTheDocument();
            if (forventAdvarsel) {
                expect(screen.getByText(NEGATIV_UTEN_FEILUTBETALING)).toBeInTheDocument();
            } else {
                expect(screen.queryByText(NEGATIV_UTEN_FEILUTBETALING)).not.toBeInTheDocument();
            }
        },
    );

    test('viser meldingen fra backend når utbetalingen ikke kan iverksettes, og ellers en standardtekst', () => {
        const props = {
            simulertBeregning: simulertBeregning(beregning(null, 2980), null),
            kanIkkeIverksetteUtbetaling: KanIkkeIverksetteUtbetalingGrunn.SimuleringMangler,
        };

        const { unmount } = renderHeader({
            ...props,
            kanIkkeIverksetteUtbetalingMelding: 'Simuleringen feilet hos Oppdrag',
        });
        expect(screen.getByText('Simuleringen feilet hos Oppdrag')).toBeInTheDocument();
        unmount();

        renderHeader(props);
        expect(
            screen.getByText('Utbetalingen kan ikke iverksettes: Simulering mangler'),
        ).toBeInTheDocument();
    });

    test('viser navkontor med navn når det finnes, og utbetalingsstatus kun når den er satt', () => {
        const { unmount } = renderHeader({
            simulertBeregning: simulertBeregning(beregning(null, 2980), null),
            utbetalingsstatus: Utbetalingsstatus.OK,
        });
        expect(screen.getByText('Nav Asker (0220)')).toBeInTheDocument();
        expect(screen.getByText('Sendt til utbetaling')).toBeInTheDocument();
        unmount();

        renderHeader({
            simulertBeregning: simulertBeregning(beregning(null, 2980), null),
            navkontorNavn: ikkeSladdet(null),
        });
        expect(screen.getByText('0220')).toBeInTheDocument();
        expect(screen.queryByText(/Utbetalingsstatus/)).not.toBeInTheDocument();
    });
});
