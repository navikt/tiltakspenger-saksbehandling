import { describe, expect, test } from '@jest/globals';
import { ikkeSladdet } from '~test/sladdetVerdi';
import { lagForhåndsutfyltInnvilgelse } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import {
    Rammebehandlingsstatus,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    RevurderingInnvilgelse,
    RevurderingResultat,
} from '~/lib/rammebehandling/typer/Revurdering';
import {
    InnvilgbarPeriode,
    InnvilgbarTiltaksdeltakelse,
    Tiltaksdeltakelse,
    TiltaksdeltakelseKilde,
    TiltakDeltakerstatus,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { SakProps } from '~/lib/sak/SakTyper';
import { Periode } from '~/types/Periode';

import { tilSaksnummer } from '~/lib/sak/Saksnummer';
import { tilDato, tilTidspunkt } from '~/types/DatoTid';

const tiltaksdeltakelse = (id: string, periode: Periode): InnvilgbarTiltaksdeltakelse => ({
    eksternDeltagelseId: id,
    gjennomføringId: null,
    typeNavn: 'Arbeidsmarkedsopplæring',
    tittel: ikkeSladdet('Arbeidsmarkedsopplæring hos Arrangør AS'),
    periode,
    deltakelseStatus: TiltakDeltakerstatus.DELTAR,
    deltakelseProsent: null,
    antallDagerPerUke: null,
    kilde: TiltaksdeltakelseKilde.ARENA,
    gjennomforingsprosent: null,
    internDeltakelseId: id,
    kanInnvilges: true,
});

const revurdering = (
    tiltaksdeltagelse: Tiltaksdeltakelse[],
    innvilgbarePerioder: InnvilgbarPeriode[],
): RevurderingInnvilgelse => ({
    id: 'beh_1',
    type: Rammebehandlingstype.REVURDERING,
    status: Rammebehandlingsstatus.UNDER_BEHANDLING,
    resultat: RevurderingResultat.INNVILGELSE,
    sakId: 'sak_1',
    saksnummer: tilSaksnummer('202501011001'),
    rammevedtakId: null,
    saksbehandler: 'Z123456',
    beslutter: null,
    saksopplysninger: {
        fødselsdato: ikkeSladdet(tilDato('1990-01-01')),
        tiltaksdeltagelse,
        tiltaksdeltakelserSomFratarRett: [],
        periode: null,
        ytelser: [],
        tiltakspengevedtakFraArena: [],
        oppslagstidspunkt: tilTidspunkt('2025-01-01T09:00:00'),
    },
    attesteringer: [],
    vedtaksperiode: null,
    fritekstTilVedtaksbrev: ikkeSladdet(null),
    begrunnelseVilkårsvurdering: ikkeSladdet(null),
    avbrutt: null,
    opprettet: tilTidspunkt('2025-01-01T09:00:00'),
    sistEndret: tilTidspunkt('2025-01-01T09:00:00'),
    iverksattTidspunkt: null,
    ventestatus: [],
    venterTil: null,
    utbetaling: null,
    utbetalingskontroll: null,
    klagebehandlingId: null,
    tilbakekrevingId: null,
    skalSendeVedtaksbrev: true,
    skalJournalføreNotat: { vilkårsvurdering: false, barnetillegg: false },
    beslutterEndringer: { skalJournalføreNotat: null },
    prioritering: null,
    gyldigeKommandoer: [],
    tidslinjeFørOgEtter: null,
    tiltakshistorikk: { innslag: [], harEndringEtterSistEndret: false },
    innvilgbarePerioder,
    manueltBehandlesGrunner: [],
    automatiskOpprettetGrunn: null,
    perioderForReversertOpphør: [],
    innvilgelsesperioder: null,
    barnetillegg: null,
});

const sakUtenVedtak: SakProps = {
    sakId: 'sak_1',
    saksnummer: tilSaksnummer('202501011001'),
    fnr: ikkeSladdet('12345678911'),
    førsteDagSomGirRett: null,
    sisteDagSomGirRett: null,
    kanSendeInnHelgForMeldekort: false,
    søknader: [],
    åpneBehandlinger: [],
    rammebehandlinger: [],
    klagebehandlinger: [],
    tilbakekrevinger: [],
    alleRammevedtak: [],
    alleKlagevedtak: [],
    meldekortvedtak: [],
    meldekortbehandlinger: {},
    meldeperiodeKjeder: [],
    tidslinje: { elementer: [] },
    innvilgetTidslinje: { elementer: [] },
    utbetalingstidslinje: [],
};

// Saken har to tiltaksdeltakelser med et opphold mellom seg.
const behandlingMedOppholdMellomDeltakelser = () => {
    const deltakelser = [
        tiltaksdeltakelse('deltakelse_1', {
            fraOgMed: tilDato('2025-01-01'),
            tilOgMed: tilDato('2025-02-28'),
        }),
        tiltaksdeltakelse('deltakelse_2', {
            fraOgMed: tilDato('2025-06-01'),
            tilOgMed: tilDato('2025-08-31'),
        }),
    ];

    return revurdering(
        deltakelser,
        deltakelser.map(({ internDeltakelseId, periode }) => ({ internDeltakelseId, periode })),
    );
};

describe('lagForhåndsutfyltInnvilgelse', () => {
    test('fyller ut innvilgelsen når en tiltaksdeltakelse overlapper perioden', () => {
        const innvilgelse = lagForhåndsutfyltInnvilgelse(
            behandlingMedOppholdMellomDeltakelser(),
            { fraOgMed: tilDato('2025-01-06'), tilOgMed: tilDato('2025-02-28') },
            sakUtenVedtak,
        );

        expect(innvilgelse).toEqual({
            harValgtPeriode: true,
            innvilgelsesperioder: [
                {
                    periode: { fraOgMed: tilDato('2025-01-06'), tilOgMed: tilDato('2025-02-28') },
                    antallDagerPerMeldeperiode: 10,
                    internDeltakelseId: 'deltakelse_1',
                    erReversertOpphør: false,
                },
            ],
            harBarnetillegg: false,
            valgteBarn: [],
            manueltLagtTilBarn: [],
        });
    });

    test('velger bare blant periodene backend sier kan innvilges, selv om andre tiltaksdeltakelser overlapper', () => {
        const periode = { fraOgMed: tilDato('2025-01-01'), tilOgMed: tilDato('2025-02-28') };
        const behandling = revurdering(
            [
                tiltaksdeltakelse('ikke_innvilgbar', periode),
                tiltaksdeltakelse('innvilgbar', periode),
            ],
            [{ internDeltakelseId: 'innvilgbar', periode }],
        );

        const innvilgelse = lagForhåndsutfyltInnvilgelse(behandling, periode, sakUtenVedtak);

        expect(innvilgelse.innvilgelsesperioder[0]?.internDeltakelseId).toBe('innvilgbar');
    });

    test('velger reversert opphør når ingen gyldig tiltaksdeltakelse overlapper perioden', () => {
        const mars = { fraOgMed: tilDato('2025-03-01'), tilOgMed: tilDato('2025-03-31') };
        const behandling = {
            ...behandlingMedOppholdMellomDeltakelser(),
            perioderForReversertOpphør: [
                { internDeltakelseId: 'deltakelse_1', periode: mars, typeNavn: 'AMO' },
            ],
        };

        const innvilgelse = lagForhåndsutfyltInnvilgelse(behandling, mars, sakUtenVedtak);

        expect(innvilgelse.innvilgelsesperioder[0]).toMatchObject({
            internDeltakelseId: 'deltakelse_1',
            erReversertOpphør: true,
        });
    });

    test('foretrekker gyldig tiltaksdeltakelse framfor reversert opphør når begge overlapper perioden', () => {
        const periode = { fraOgMed: tilDato('2025-02-01'), tilOgMed: tilDato('2025-02-28') };
        const behandling = {
            ...behandlingMedOppholdMellomDeltakelser(),
            perioderForReversertOpphør: [
                { internDeltakelseId: 'deltakelse_3', periode, typeNavn: 'AMO' },
            ],
        };

        const innvilgelse = lagForhåndsutfyltInnvilgelse(behandling, periode, sakUtenVedtak);

        expect(innvilgelse.innvilgelsesperioder[0]).toMatchObject({
            internDeltakelseId: 'deltakelse_1',
            erReversertOpphør: false,
        });
    });
});
