import { ikkeSladdet } from '~test/sladdetVerdi';
import {
    RammebehandlingBase,
    Rammebehandlingsstatus,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    Avslagsgrunn,
    SøknadsbehandlingAvslag,
    SøknadsbehandlingIkkeValgt,
    SøknadsbehandlingInnvilgelse,
    SøknadsbehandlingResultat,
} from '~/lib/rammebehandling/typer/Søknadsbehandling';
import {
    OmgjøringIkkeValgt,
    OmgjøringInnvilgelse,
    OmgjøringOpphør,
    RevurderingInnvilgelse,
    RevurderingResultat,
    RevurderingStans,
} from '~/lib/rammebehandling/typer/Revurdering';
import {
    Tiltaksdeltakelse,
    TiltaksdeltakelseKilde,
    TiltakDeltakerstatus,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import {
    InnvilgbarSøknad,
    Spørsmålsbesvarelser,
    SøknadBarn,
    SøknadBarnKilde,
} from '~/lib/søknad/søknadTyper';
import { SakProps } from '~/lib/sak/SakTyper';
import { tilSaksnummer } from '~/lib/sak/Saksnummer';
import { Rammevedtak, VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import { Innvilgelsesperiode } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { BarnetilleggPeriode } from '~/lib/rammebehandling/typer/Barnetillegg';
import { Periode } from '~/types/Periode';

/**
 * Byggere for testdata som etterligner rammebehandlinger og saker fra API-et.
 * Alle byggere tar imot overstyringer, slik at hver test kun trenger å sette feltene som er relevante for den.
 */

export const periode = (fraOgMed: string, tilOgMed: string): Periode => ({ fraOgMed, tilOgMed });

export const innvilgelsesperiode = (
    p: Periode,
    overstyringer: Partial<Innvilgelsesperiode> = {},
): Innvilgelsesperiode => ({
    periode: p,
    antallDagerPerMeldeperiode: 10,
    internDeltakelseId: 'deltakelse_1',
    ...overstyringer,
});

export const barnetilleggPeriode = (antallBarn: number, p: Periode): BarnetilleggPeriode => ({
    antallBarn,
    periode: p,
});

export const tiltaksdeltakelse = (
    id: string,
    p: Periode,
    antallDagerPerUke: number | null = null,
): Tiltaksdeltakelse => ({
    eksternDeltagelseId: id,
    gjennomføringId: null,
    typeNavn: 'Arbeidsmarkedsopplæring',
    typeKode: 'AMO',
    deltagelseFraOgMed: p.fraOgMed,
    deltagelseTilOgMed: p.tilOgMed,
    deltakelseStatus: TiltakDeltakerstatus.DELTAR,
    deltakelseProsent: null,
    antallDagerPerUke,
    kilde: TiltaksdeltakelseKilde.ARENA,
    gjennomforingsprosent: null,
    internDeltakelseId: id,
});

export const søknadBarn = (fødselsdato: string): SøknadBarn => ({
    oppholderSegIEØSSpm: { svar: 'JA' },
    oppholdssted: 'NORGE',
    fornavn: ikkeSladdet('Barn'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet('Barnesen'),
    fødselsdato: ikkeSladdet(fødselsdato),
    kilde: SøknadBarnKilde.PDL,
    fnr: ikkeSladdet(null),
});

export const søknad = (barnetillegg: SøknadBarn[] = []): InnvilgbarSøknad => ({
    id: 'soknad_1',
    journalpostId: 'journalpost_1',
    tiltak: {
        id: 'deltakelse_1',
        fraOgMed: '2025-01-01',
        tilOgMed: '2025-06-30',
        typeKode: 'AMO',
        typeNavn: 'Arbeidsmarkedsopplæring',
    },
    tiltaksdeltakelseperiodeDetErSøktOm: periode('2025-01-01', '2025-06-30'),
    barnetillegg,
    søknadstype: 'DIGITAL',
    behandlingsarsak: null,
    opprettet: '2025-01-01T09:00:00',
    mottatt: '2025-01-01T09:00:00',
    antallVedlegg: 0,
    avbrutt: [],
    kanInnvilges: true,
    // Spørsmålene brukes ikke av skjema-logikken
    svar: {} as Spørsmålsbesvarelser,
});

// Standard tiltaksdeltakelse for testbehandlingene
export const standardTiltaksdeltakelse = tiltaksdeltakelse(
    'deltakelse_1',
    periode('2025-01-01', '2025-06-30'),
);

const rammebehandlingBase = (): Omit<RammebehandlingBase, 'type' | 'resultat'> => ({
    id: 'beh_1',
    status: Rammebehandlingsstatus.UNDER_BEHANDLING,
    sakId: 'sak_1',
    saksnummer: tilSaksnummer('202501011001'),
    rammevedtakId: null,
    saksbehandler: 'Z123456',
    beslutter: null,
    saksopplysninger: {
        fødselsdato: ikkeSladdet('1990-01-01'),
        tiltaksdeltagelse: [standardTiltaksdeltakelse],
        tiltaksdeltakelserSomFratarRett: [],
        periode: null,
        ytelser: [],
        tiltakspengevedtakFraArena: [],
        oppslagstidspunkt: '2025-01-01T09:00:00',
    },
    attesteringer: [],
    vedtaksperiode: null,
    fritekstTilVedtaksbrev: ikkeSladdet(null),
    begrunnelseVilkårsvurdering: ikkeSladdet(null),
    avbrutt: null,
    opprettet: '2025-01-01T09:00:00',
    sistEndret: '2025-01-01T09:00:00',
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
    manueltBehandlesGrunner: [],
    tidslinjeFørOgEtter: null,
});

const søknadsbehandlingBase = () => ({
    ...rammebehandlingBase(),
    type: Rammebehandlingstype.SØKNADSBEHANDLING as const,
    søknad: søknad(),
    automatiskSaksbehandlet: false,
    kanInnvilges: true,
});

export const søknadsbehandlingIkkeValgt = (
    overstyringer: Partial<SøknadsbehandlingIkkeValgt> = {},
): SøknadsbehandlingIkkeValgt => ({
    ...søknadsbehandlingBase(),
    resultat: SøknadsbehandlingResultat.IKKE_VALGT,
    ...overstyringer,
});

export const søknadsbehandlingAvslag = (
    overstyringer: Partial<SøknadsbehandlingAvslag> = {},
): SøknadsbehandlingAvslag => ({
    ...søknadsbehandlingBase(),
    resultat: SøknadsbehandlingResultat.AVSLAG,
    vedtaksperiode: periode('2025-01-01', '2025-06-30'),
    avslagsgrunner: [Avslagsgrunn.Alder],
    ...overstyringer,
});

export const søknadsbehandlingInnvilgelse = (
    overstyringer: Partial<SøknadsbehandlingInnvilgelse> = {},
): SøknadsbehandlingInnvilgelse => ({
    ...søknadsbehandlingBase(),
    resultat: SøknadsbehandlingResultat.INNVILGELSE,
    vedtaksperiode: periode('2025-01-01', '2025-03-31'),
    innvilgelsesperioder: [innvilgelsesperiode(periode('2025-01-01', '2025-03-31'))],
    barnetillegg: { perioder: [], begrunnelse: ikkeSladdet(null) },
    ...overstyringer,
});

const revurderingBase = () => ({
    ...rammebehandlingBase(),
    type: Rammebehandlingstype.REVURDERING as const,
    automatiskOpprettetGrunn: null,
});

export const revurderingStans = (
    overstyringer: Partial<RevurderingStans> = {},
): RevurderingStans => ({
    ...revurderingBase(),
    resultat: RevurderingResultat.STANS,
    valgtHjemmelHarIkkeRettighet: null,
    harValgtStansFraFørsteDagSomGirRett: null,
    harValgtStansTilSisteDagSomGirRett: null,
    ...overstyringer,
});

export const revurderingInnvilgelse = (
    overstyringer: Partial<RevurderingInnvilgelse> = {},
): RevurderingInnvilgelse => ({
    ...revurderingBase(),
    resultat: RevurderingResultat.INNVILGELSE,
    innvilgelsesperioder: null,
    barnetillegg: null,
    ...overstyringer,
});

export const omgjøringIkkeValgt = (
    overstyringer: Partial<OmgjøringIkkeValgt> = {},
): OmgjøringIkkeValgt => ({
    ...revurderingBase(),
    resultat: RevurderingResultat.OMGJØRING_IKKE_VALGT,
    omgjørRammevedtak: [],
    ...overstyringer,
});

export const omgjøringInnvilgelse = (
    overstyringer: Partial<OmgjøringInnvilgelse> = {},
): OmgjøringInnvilgelse => ({
    ...revurderingBase(),
    resultat: RevurderingResultat.OMGJØRING,
    vedtaksperiode: periode('2025-01-01', '2025-03-31'),
    innvilgelsesperioder: null,
    barnetillegg: null,
    omgjørRammevedtak: [],
    skalSendeVedtaksbrev: true,
    ...overstyringer,
});

export const omgjøringOpphør = (overstyringer: Partial<OmgjøringOpphør> = {}): OmgjøringOpphør => ({
    ...revurderingBase(),
    resultat: RevurderingResultat.OMGJØRING_OPPHØR,
    vedtaksperiode: periode('2025-01-01', '2025-03-31'),
    valgteHjemler: [],
    omgjørRammevedtak: [],
    ...overstyringer,
});

export const rammevedtak = (
    id: VedtakId,
    p: Periode,
    overstyringer: Partial<Rammevedtak> = {},
): Rammevedtak => ({
    id,
    behandlingId: 'beh_vedtatt',
    opprettet: '2025-01-01T09:00:00',
    vedtaksdato: '2025-01-01',
    resultat: SøknadsbehandlingResultat.INNVILGELSE,
    opprinneligVedtaksperiode: p,
    opprinneligInnvilgetPerioder: [p],
    gjeldendeVedtaksperioder: [p],
    gjeldendeInnvilgetPerioder: [p],
    saksbehandler: 'Z123456',
    beslutter: 'Z654321',
    innvilgelsesperioder: null,
    barnetillegg: null,
    gjeldendeBarnetilleggPerioder: [],
    erGjeldende: true,
    gyldigeKommandoer: {},
    omgjortGrad: null,
    ...overstyringer,
});

export const sak = (overstyringer: Partial<SakProps> = {}): SakProps => ({
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
    ...overstyringer,
});

// Sak med ett innvilget vedtak fra en søknadsbehandling, som gjelder for hele perioden
export const sakMedInnvilgetVedtak = (
    vedtaksperiode: Periode,
    overstyringer: {
        vedtak?: Partial<Rammevedtak>;
        søknadsbehandling?: SøknadsbehandlingInnvilgelse;
    } = {},
): SakProps => {
    const vedtattBehandling =
        overstyringer.søknadsbehandling ??
        søknadsbehandlingInnvilgelse({
            id: 'beh_vedtatt',
            status: Rammebehandlingsstatus.VEDTATT,
            iverksattTidspunkt: '2025-01-01T09:00:00',
            vedtaksperiode,
            innvilgelsesperioder: [innvilgelsesperiode(vedtaksperiode)],
        });

    const vedtak = rammevedtak('vedtak_1', vedtaksperiode, {
        behandlingId: vedtattBehandling.id,
        ...overstyringer.vedtak,
    });

    const tidslinjeElement = {
        rammevedtakId: vedtak.id,
        periode: vedtaksperiode,
        tidslinjeResultat: TidslinjeResultat.SØKNADSBEHANDLING_INNVILGELSE,
    };

    return sak({
        rammebehandlinger: [vedtattBehandling],
        alleRammevedtak: [vedtak],
        tidslinje: { elementer: [tidslinjeElement] },
        innvilgetTidslinje: { elementer: [tidslinjeElement] },
    });
};
