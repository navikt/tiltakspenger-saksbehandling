import { describe, expect, test } from '@jest/globals';
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
    Tiltaksdeltakelse,
    TiltaksdeltakelseKilde,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { SakProps } from '~/lib/sak/SakTyper';
import { Periode } from '~/types/Periode';

const tiltaksdeltakelse = (id: string, periode: Periode): Tiltaksdeltakelse => ({
    eksternDeltagelseId: id,
    gjennomføringId: null,
    typeNavn: 'Arbeidsmarkedsopplæring',
    typeKode: 'AMO',
    deltagelseFraOgMed: periode.fraOgMed,
    deltagelseTilOgMed: periode.tilOgMed,
    deltakelseStatus: 'DELTAR',
    deltakelseProsent: null,
    antallDagerPerUke: null,
    kilde: TiltaksdeltakelseKilde.ARENA,
    gjennomforingsprosent: null,
    internDeltakelseId: id,
});

const revurdering = (tiltaksdeltagelse: Tiltaksdeltakelse[]): RevurderingInnvilgelse => ({
    id: 'beh_1',
    type: Rammebehandlingstype.REVURDERING,
    status: Rammebehandlingsstatus.UNDER_BEHANDLING,
    resultat: RevurderingResultat.INNVILGELSE,
    sakId: 'sak_1',
    saksnummer: '202501011001',
    rammevedtakId: null,
    saksbehandler: 'Z123456',
    beslutter: null,
    saksopplysninger: {
        fødselsdato: '1990-01-01',
        tiltaksdeltagelse,
        periode: null,
        ytelser: [],
        tiltakspengevedtakFraArena: [],
        oppslagstidspunkt: '2025-01-01T09:00:00',
    },
    attesteringer: [],
    vedtaksperiode: null,
    fritekstTilVedtaksbrev: null,
    begrunnelseVilkårsvurdering: null,
    avbrutt: null,
    opprettet: '2025-01-01T09:00:00',
    sistEndret: '2025-01-01T09:00:00',
    iverksattTidspunkt: null,
    ventestatus: [],
    utbetaling: null,
    utbetalingskontroll: null,
    klagebehandlingId: null,
    tilbakekrevingId: null,
    skalSendeVedtaksbrev: true,
    gyldigeKommandoer: [],
    automatiskOpprettetGrunn: null,
    innvilgelsesperioder: null,
    barnetillegg: null,
});

const sakUtenVedtak: SakProps = {
    sakId: 'sak_1',
    saksnummer: '202501011001',
    fnr: '12345678911',
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
const behandlingMedOppholdMellomDeltakelser = () =>
    revurdering([
        tiltaksdeltakelse('deltakelse_1', { fraOgMed: '2025-01-01', tilOgMed: '2025-02-28' }),
        tiltaksdeltakelse('deltakelse_2', { fraOgMed: '2025-06-01', tilOgMed: '2025-08-31' }),
    ]);

describe('lagForhåndsutfyltInnvilgelse', () => {
    test('fyller ut innvilgelsen når en tiltaksdeltakelse overlapper perioden', () => {
        const innvilgelse = lagForhåndsutfyltInnvilgelse(
            behandlingMedOppholdMellomDeltakelser(),
            { fraOgMed: '2025-01-06', tilOgMed: '2025-02-28' },
            sakUtenVedtak,
        );

        expect(innvilgelse).toEqual({
            harValgtPeriode: true,
            innvilgelsesperioder: [
                {
                    periode: { fraOgMed: '2025-01-06', tilOgMed: '2025-02-28' },
                    antallDagerPerMeldeperiode: 10,
                    internDeltakelseId: 'deltakelse_1',
                },
            ],
            harBarnetillegg: false,
            barnetilleggPerioder: [],
            skalSendeVedtaksbrev: true,
        });
    });
});
