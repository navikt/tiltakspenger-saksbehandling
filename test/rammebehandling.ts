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
    RevurderingForlengelse,
    RevurderingInnvilgelse,
    RevurderingResultat,
    RevurderingStans,
    RevurderingUbestemt,
    TiltaksdeltakerEndringType,
} from '~/lib/rammebehandling/typer/Revurdering';
import {
    InnvilgbarTiltaksdeltakelse,
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
import {
    BarnetilleggBarn,
    BarnetilleggBarnKilde,
    BarnetilleggPeriode,
    BarnetilleggV1,
    BarnetilleggV2,
    BarnetilleggVersjon,
    OppdaterBarnetilleggDTO,
} from '~/lib/rammebehandling/typer/Barnetillegg';
import { Periode } from '~/types/Periode';
import { Dato, tilDato, tilTidspunkt } from '~/types/DatoTid';

/**
 * Byggere for testdata som etterligner rammebehandlinger og saker fra API-et.
 * Alle byggere tar imot overstyringer, slik at hver test kun trenger å sette feltene som er relevante for den.
 */

export const periode = (fraOgMed: string, tilOgMed: string): Periode => ({
    fraOgMed: tilDato(fraOgMed),
    tilOgMed: tilDato(tilOgMed),
});

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

export const barnetilleggV1 = (perioder: BarnetilleggPeriode[] = []): BarnetilleggV1 => ({
    versjon: BarnetilleggVersjon.V1,
    perioder,
    begrunnelse: ikkeSladdet(null),
    barn: null,
});

// Et barn valgt for barnetillegg, med hele innvilgelsesperioden
export const barnetilleggBarn = (
    fødselsdato: string,
    overstyringer: Partial<BarnetilleggBarn> = {},
): BarnetilleggBarn => ({
    fnr: ikkeSladdet(null),
    fornavn: ikkeSladdet('Barn'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet('Barnesen'),
    fødselsdato: ikkeSladdet(tilDato(fødselsdato)),
    kilde: BarnetilleggBarnKilde.SØKNAD,
    søknadId: 'soknad_1',
    periode: null,
    ...overstyringer,
});

// Periodiseringen backend gjør av barnetillegget, uavhengig av appens egen implementasjon.
// Fixturene brukes også av e2e-testene, og kan derfor ikke importere app-kode som bruker dayjs.
const leggTilDager = (dato: Dato, dager: number): Dato => {
    const dag = new Date(`${dato}T00:00:00Z`);
    dag.setUTCDate(dag.getUTCDate() + dager);
    return tilDato(dag.toISOString().slice(0, 10));
};

const overlapp = (a: Periode, b: Periode): Periode | null => {
    const fraOgMed = a.fraOgMed > b.fraOgMed ? a.fraOgMed : b.fraOgMed;
    const tilOgMed = a.tilOgMed < b.tilOgMed ? a.tilOgMed : b.tilOgMed;
    return fraOgMed <= tilOgMed ? { fraOgMed, tilOgMed } : null;
};

const perioderMedBarnetillegg = (barn: BarnetilleggBarn, innvilgelsesperioder: Periode[]) => {
    if (barn.fødselsdato.erSladdet || innvilgelsesperioder.length === 0) {
        return [];
    }

    const fødselsdato = barn.fødselsdato.verdi;
    const sekstenårsdag = tilDato(`${Number(fødselsdato.slice(0, 4)) + 16}${fødselsdato.slice(4)}`);
    const rett = { fraOgMed: fødselsdato, tilOgMed: leggTilDager(sekstenårsdag, -1) };

    const sorterte = innvilgelsesperioder.toSorted((a, b) => (a.fraOgMed < b.fraOgMed ? -1 : 1));
    const total = { fraOgMed: sorterte[0].fraOgMed, tilOgMed: sorterte.at(-1)!.tilOgMed };
    const basis = overlapp(barn.periode ?? total, rett);

    return basis
        ? sorterte.map((it) => overlapp(basis, it)).filter((it): it is Periode => it !== null)
        : [];
};

const periodiserAntallBarn = (perioderPerBarn: Periode[][]): BarnetilleggPeriode[] => {
    const alle = perioderPerBarn.flat();

    if (alle.length === 0) {
        return [];
    }

    const fraOgMed = alle.map((it) => it.fraOgMed).toSorted()[0];
    const tilOgMed = alle
        .map((it) => it.tilOgMed)
        .toSorted()
        .at(-1)!;

    const resultat: BarnetilleggPeriode[] = [];

    for (let dag = fraOgMed; dag <= tilOgMed; dag = leggTilDager(dag, 1)) {
        const antallBarn = perioderPerBarn.filter((perioder) =>
            perioder.some((it) => it.fraOgMed <= dag && dag <= it.tilOgMed),
        ).length;

        const forrige = resultat.at(-1);

        if (antallBarn === 0) {
            continue;
        }

        if (
            forrige?.antallBarn === antallBarn &&
            leggTilDager(forrige.periode.tilOgMed, 1) === dag
        ) {
            forrige.periode = { ...forrige.periode, tilOgMed: dag };
        } else {
            resultat.push({ antallBarn, periode: { fraOgMed: dag, tilOgMed: dag } });
        }
    }

    return resultat;
};

// Barnetillegg med barn, med perioder utledet slik backend gjør det
export const barnetilleggV2 = (
    barn: BarnetilleggBarn[],
    innvilgelsesperioder: Periode[],
): BarnetilleggV2 => {
    const barnMedPerioder = barn.map((it) => ({
        ...it,
        perioderMedBarnetillegg: perioderMedBarnetillegg(it, innvilgelsesperioder),
    }));

    return {
        versjon: BarnetilleggVersjon.V2,
        perioder: periodiserAntallBarn(barnMedPerioder.map((it) => it.perioderMedBarnetillegg)),
        begrunnelse: ikkeSladdet(null),
        barn: barnMedPerioder,
    };
};

// Barnetillegget backend lagrer fra barnetillegget som sendes inn
export const barnetilleggFraOppdaterDTO = (
    dto: OppdaterBarnetilleggDTO,
    innvilgelsesperioder: Periode[],
): BarnetilleggV2 => ({
    ...barnetilleggV2(
        dto.barn.map((barn) => ({
            fnr: ikkeSladdet(barn.fnr),
            fornavn: ikkeSladdet(barn.fornavn),
            mellomnavn: ikkeSladdet(barn.mellomnavn),
            etternavn: ikkeSladdet(barn.etternavn),
            fødselsdato: ikkeSladdet(barn.fødselsdato),
            kilde: barn.kilde,
            søknadId: barn.søknadId,
            periode: barn.periode,
        })),
        innvilgelsesperioder,
    ),
    begrunnelse: ikkeSladdet(dto.begrunnelse),
});

export const tiltaksdeltakelse = (
    id: string,
    p: Periode,
    antallDagerPerUke: number | null = null,
): InnvilgbarTiltaksdeltakelse => ({
    eksternDeltagelseId: id,
    gjennomføringId: null,
    typeNavn: 'Arbeidsmarkedsopplæring',
    periode: p,
    deltakelseStatus: TiltakDeltakerstatus.DELTAR,
    deltakelseProsent: null,
    antallDagerPerUke,
    kilde: TiltaksdeltakelseKilde.ARENA,
    gjennomforingsprosent: null,
    internDeltakelseId: id,
    kanInnvilges: true,
});

export const søknadBarn = (fødselsdato: string): SøknadBarn => ({
    oppholderSegIEØSSpm: { svar: 'JA' },
    oppholdssted: 'NORGE',
    fornavn: ikkeSladdet('Barn'),
    mellomnavn: ikkeSladdet(null),
    etternavn: ikkeSladdet('Barnesen'),
    fødselsdato: ikkeSladdet(tilDato(fødselsdato)),
    kilde: SøknadBarnKilde.PDL,
    fnr: ikkeSladdet(null),
});

export const søknad = (barnetillegg: SøknadBarn[] = []): InnvilgbarSøknad => ({
    id: 'soknad_1',
    journalpostId: 'journalpost_1',
    tiltak: {
        id: 'deltakelse_1',
        internDeltakelseId: 'deltakelse_1',
        fraOgMed: tilDato('2025-01-01'),
        tilOgMed: tilDato('2025-06-30'),
        typeNavn: 'Arbeidsmarkedsopplæring',
    },
    tiltaksdeltakelseperiodeDetErSøktOm: periode('2025-01-01', '2025-06-30'),
    barnetillegg,
    søknadstype: 'DIGITAL',
    behandlingsarsak: null,
    opprettet: tilTidspunkt('2025-01-01T09:00:00'),
    mottatt: tilTidspunkt('2025-01-01T09:00:00'),
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
        fødselsdato: ikkeSladdet(tilDato('1990-01-01')),
        tiltaksdeltagelse: [standardTiltaksdeltakelse],
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
    manueltBehandlesGrunner: [],
    tidslinjeFørOgEtter: null,
    tiltakshistorikk: { innslag: [], harEndringEtterSistEndret: false },
    innvilgbarePerioder: [
        {
            internDeltakelseId: standardTiltaksdeltakelse.internDeltakelseId,
            periode: standardTiltaksdeltakelse.periode,
        },
    ],
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
    barnetillegg: barnetilleggV2([], [periode('2025-01-01', '2025-03-31')]),
    ...overstyringer,
});

const revurderingBase = () => ({
    ...rammebehandlingBase(),
    type: Rammebehandlingstype.REVURDERING as const,
    automatiskOpprettetGrunn: null,
    perioderForReversertOpphør: [],
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

export const revurderingForlengelse = (
    overstyringer: Partial<RevurderingForlengelse> = {},
): RevurderingForlengelse => ({
    ...revurderingBase(),
    resultat: RevurderingResultat.FORLENGELSE,
    forlengerRammevedtakId: 'vedtak_1',
    forlengesFraOgMed: tilDato('2025-04-01'),
    harEndretBarnetillegg: false,
    kanIkkeUtledeBarnetillegg: false,
    tiltaksdeltakelserSomKanForlenges: [standardTiltaksdeltakelse.internDeltakelseId],
    innvilgelsesperioder: null,
    barnetillegg: null,
    ...overstyringer,
});

export const revurderingUbestemt = (
    overstyringer: Partial<RevurderingUbestemt> = {},
): RevurderingUbestemt => ({
    ...revurderingBase(),
    resultat: RevurderingResultat.UBESTEMT,
    automatiskOpprettetGrunn: {
        endringer: [{ type: TiltaksdeltakerEndringType.AVBRUTT_DELTAKELSE }],
    },
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
    opprettet: tilTidspunkt('2025-01-01T09:00:00'),
    vedtaksdato: tilDato('2025-01-01'),
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
        // Søknaden som er innvilget, når søknadsbehandlingen ikke er overstyrt
        søknad?: InnvilgbarSøknad;
    } = {},
): SakProps => {
    const vedtattBehandling =
        overstyringer.søknadsbehandling ??
        søknadsbehandlingInnvilgelse({
            id: 'beh_vedtatt',
            status: Rammebehandlingsstatus.VEDTATT,
            iverksattTidspunkt: tilTidspunkt('2025-01-01T09:00:00'),
            vedtaksperiode,
            innvilgelsesperioder: [innvilgelsesperiode(vedtaksperiode)],
            ...(overstyringer.søknad && { søknad: overstyringer.søknad }),
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
