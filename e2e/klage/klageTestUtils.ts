import {
    KlagebehandlingResultat,
    KlagebehandlingStatus,
    KlageInnsendingskilde,
} from '~/lib/klage/typer/Klage';
import type {
    KlageId,
    Klagebehandling,
    OppdaterKlageFormkravRequest,
} from '~/lib/klage/typer/Klage';
import type { SakId, SakProps } from '~/lib/sak/SakTyper';
import { SaksbehandlerRolle } from '~/lib/saksbehandler/SaksbehandlerTyper';
import type { Saksbehandler } from '~/lib/saksbehandler/SaksbehandlerTyper';
import type { Personopplysninger } from '~/lib/personaliaheader/useHentPersonopplysninger';
import {
    Rammebehandlingsstatus,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import type { RevurderingStans } from '~/lib/rammebehandling/typer/Revurdering';
import { SøknadsbehandlingResultat } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import type { Søknadsbehandling } from '~/lib/rammebehandling/typer/Søknadsbehandling';
import type { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import type { Rammevedtak, VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import type { Søknad, SøknadId } from '~/types/Søknad';
import {
    KlageHendelseKlagebehandlingAvsluttetUtfall,
    KlageHendelsestype,
} from '~/lib/klage/typer/Klageinstanshendelse';
import type {
    KlagebehandlingAvsluttetHendelse,
    KlageinstanshendelseId,
} from '~/lib/klage/typer/Klageinstanshendelse';

const saksnummer = '10001';
const sakId: SakId = 'sak_01ABC';
const klageId: KlageId = 'klage_01ABC';
const fnr = '12345678911';
const navIdent = 'Z12345';
const beslutterIdent = 'Z99999';
const journalpostId = '453827';
const vedtakId: VedtakId = 'vedtak_01ABC';
const rammebehandlingId: RammebehandlingId = 'beh_01ABC';
const omgjøringsbehandlingId: RammebehandlingId = 'beh_OMGJORING';
const klageinstanshendelseId: KlageinstanshendelseId = 'klagehendelse_01ABC';
const søknadId: SøknadId = 'soknad_01ABC';

const lagInitiellKlage = (): Klagebehandling => ({
    id: klageId,
    sakId,
    saksnummer,
    fnr,
    opprettet: '2025-04-01T10:00:00',
    sistEndret: '2025-04-01T10:00:00',
    iverksattTidspunkt: null,
    saksbehandler: navIdent,
    klagensJournalpostId: journalpostId,
    klagensJournalpostOpprettet: '2025-04-01T10:00:00',
    status: KlagebehandlingStatus.UNDER_BEHANDLING,
    resultat: null,
    avbrutt: null,
    kanIverksetteVedtak: null,
    kanIverksetteOpprettholdelse: false,
    ventestatus: [],
    formkrav: {
        vedtakDetKlagesPå: null,
        erKlagerPartISaken: true,
        klagesDetPåKonkreteElementerIVedtaket: true,
        erKlagefristenOverholdt: true,
        erUnntakForKlagefrist: null,
        erKlagenSignert: true,
        innsendingsdato: '2025-04-01',
        innsendingskilde: KlageInnsendingskilde.DIGITAL,
    },
    tilknyttedeBehandlingIder: [],
    åpenBehandlingId: null,
});

const vedtaksperiode = { fraOgMed: '2025-01-01', tilOgMed: '2025-03-31' };

const lagRammevedtak = (): Rammevedtak => ({
    id: vedtakId,
    behandlingId: rammebehandlingId,
    opprettet: '2025-03-25T10:00:00',
    vedtaksdato: '2025-03-25',
    resultat: RevurderingResultat.STANS,
    opprinneligVedtaksperiode: vedtaksperiode,
    opprinneligInnvilgetPerioder: [],
    gjeldendeVedtaksperioder: [],
    gjeldendeInnvilgetPerioder: [],
    saksbehandler: navIdent,
    beslutter: beslutterIdent,
    innvilgelsesperioder: [],
    barnetillegg: null,
    erGjeldende: true,
    gyldigeKommandoer: {},
    omgjortGrad: null,
});

const lagRammebehandling = (): RevurderingStans => ({
    id: rammebehandlingId,
    type: Rammebehandlingstype.REVURDERING,
    status: Rammebehandlingsstatus.VEDTATT,
    resultat: RevurderingResultat.STANS,
    sakId,
    saksnummer,
    rammevedtakId: vedtakId,
    saksbehandler: navIdent,
    beslutter: beslutterIdent,
    saksopplysninger: {
        fødselsdato: '1990-01-01',
        tiltaksdeltagelse: [],
        periode: vedtaksperiode,
        ytelser: [],
        tiltakspengevedtakFraArena: [],
        oppslagstidspunkt: '2025-03-25T10:00:00',
    },
    attesteringer: [],
    vedtaksperiode: vedtaksperiode,
    fritekstTilVedtaksbrev: null,
    begrunnelseVilkårsvurdering: null,
    avbrutt: null,
    opprettet: '2025-03-20T10:00:00',
    sistEndret: '2025-03-25T10:00:00',
    iverksattTidspunkt: '2025-03-25T10:00:00',
    ventestatus: [],
    utbetaling: null,
    utbetalingskontroll: null,
    klagebehandlingId: null,
    tilbakekrevingId: null,
    skalSendeVedtaksbrev: false,
    automatiskOpprettetGrunn: null,
    valgtHjemmelHarIkkeRettighet: null,
    harValgtStansFraFørsteDagSomGirRett: null,
    harValgtStansTilSisteDagSomGirRett: null,
});

const lagSøknad = (): Søknad => {
    const ikkeBesvartPeriodeSpm = { svar: 'IKKE_BESVART' as const, periode: vedtaksperiode };
    const ikkeBesvartJaNeiSpm = { svar: 'IKKE_BESVART' as const };
    const ikkeBesvartFraOgMedSpm = { svar: 'IKKE_BESVART' as const, fraOgMed: '2025-01-01' };

    return {
        id: søknadId,
        journalpostId,
        tiltak: null,
        tiltaksdeltakelseperiodeDetErSøktOm: null,
        barnetillegg: [],
        søknadstype: 'DIGITAL',
        behandlingsarsak: null,
        opprettet: '2025-03-01T10:00:00',
        tidsstempelHosOss: '2025-03-01T10:00:00',
        antallVedlegg: 0,
        avbrutt: null,
        kanInnvilges: false,
        svar: {
            harSøktPåTiltak: undefined,
            harSøktOmBarnetillegg: undefined,
            kvp: ikkeBesvartPeriodeSpm,
            intro: ikkeBesvartPeriodeSpm,
            institusjon: ikkeBesvartPeriodeSpm,
            sykepenger: ikkeBesvartPeriodeSpm,
            etterlønn: ikkeBesvartJaNeiSpm,
            alderspensjon: ikkeBesvartFraOgMedSpm,
            gjenlevendepensjon: ikkeBesvartPeriodeSpm,
            supplerendeStønadAlder: ikkeBesvartPeriodeSpm,
            supplerendeStønadFlyktning: ikkeBesvartPeriodeSpm,
            trygdOgPensjon: ikkeBesvartPeriodeSpm,
            jobbsjansen: ikkeBesvartPeriodeSpm,
        },
    };
};

const lagOmgjøringsbehandling = (): Søknadsbehandling => ({
    id: omgjøringsbehandlingId,
    type: Rammebehandlingstype.SØKNADSBEHANDLING,
    status: Rammebehandlingsstatus.UNDER_BEHANDLING,
    resultat: SøknadsbehandlingResultat.IKKE_VALGT,
    sakId,
    saksnummer,
    rammevedtakId: null,
    saksbehandler: navIdent,
    beslutter: null,
    saksopplysninger: {
        fødselsdato: '1990-01-01',
        tiltaksdeltagelse: [],
        periode: vedtaksperiode,
        ytelser: [],
        tiltakspengevedtakFraArena: [],
        oppslagstidspunkt: '2025-04-03T10:00:00',
    },
    attesteringer: [],
    vedtaksperiode: null,
    fritekstTilVedtaksbrev: null,
    begrunnelseVilkårsvurdering: null,
    avbrutt: null,
    opprettet: '2025-04-03T10:00:00',
    sistEndret: '2025-04-03T10:00:00',
    iverksattTidspunkt: null,
    ventestatus: [],
    utbetaling: null,
    utbetalingskontroll: null,
    klagebehandlingId: klageId,
    tilbakekrevingId: null,
    skalSendeVedtaksbrev: true,
    søknad: lagSøknad(),
    automatiskSaksbehandlet: false,
    manueltBehandlesGrunner: [],
    kanInnvilges: true,
});

const lagSak = (klage: Klagebehandling | null, options?: { søknader?: Søknad[] }): SakProps => ({
    sakId,
    saksnummer,
    fnr,
    åpneBehandlinger: [],
    meldeperiodeKjeder: [],
    behandlinger: [lagRammebehandling()],
    klageBehandlinger: klage ? [klage] : [],
    tidslinje: { elementer: [] },
    innvilgetTidslinje: { elementer: [] },
    alleRammevedtak: [lagRammevedtak()],
    alleKlagevedtak: [],
    utbetalingstidslinje: [],
    søknader: options?.søknader ?? [],
    tilbakekrevinger: [],
    kanSendeInnHelgForMeldekort: false,
    meldekortvedtak: [],
    meldekortbehandlinger: {},
    meldeperiodeKjederV2: [],
    åpenMeldekortbehandlingId: null,
});

const saksbehandler: Saksbehandler = {
    brukernavn: 'Test Testesen',
    epost: 'test.testesen@nav.no',
    navIdent,
    roller: [SaksbehandlerRolle.SAKSBEHANDLER, SaksbehandlerRolle.BESLUTTER],
};

const personopplysninger: Personopplysninger = {
    fnr,
    fødselsdato: '1990-01-01',
    fornavn: 'Ola',
    etternavn: 'Nordmann',
    fortrolig: false,
    strengtFortrolig: false,
    strengtFortroligUtland: false,
    skjermet: false,
};

/**
 * Regner ut om formkravene fører til avvisning, på samme måte som backend/`kanVurdereKlage`.
 */
const skalAvvises = (formkrav: OppdaterKlageFormkravRequest): boolean =>
    !(
        formkrav.vedtakDetKlagesPå !== null &&
        formkrav.erKlagerPartISaken &&
        formkrav.klagesDetPåKonkreteElementerIVedtaket &&
        formkrav.erKlagefristenOverholdt &&
        formkrav.erKlagenSignert
    );

const lagKlagebehandlingAvsluttetHendelse = (
    utfall: KlageHendelseKlagebehandlingAvsluttetUtfall,
): KlagebehandlingAvsluttetHendelse => ({
    klagehendelseId: klageinstanshendelseId,
    klagebehandlingId: klageId,
    opprettet: '2025-04-07T12:00:00',
    sistEndret: '2025-04-07T12:00:00',
    eksternKlagehendelseId: 'ekstern-klagehendelse-1',
    avsluttetTidspunkt: '2025-04-07T12:00:00',
    journalpostreferanser: [],
    hendelsestype: KlageHendelsestype.KLAGEBEHANDLING_AVSLUTTET,
    utfall,
});

/**
 * Muterer en opprettholdt klage slik den ser ut etter at Nav Klageinstans har journalført,
 * distribuert, mottatt og svart på innstillingsbrevet.
 */
const simulerSvarFraKlageinstans = (
    klage: Klagebehandling,
    utfall: KlageHendelseKlagebehandlingAvsluttetUtfall,
): void => {
    if (klage.resultat?.type !== KlagebehandlingResultat.OPPRETTHOLDT) {
        throw new Error('simulerSvarFraKlageinstans krever en opprettholdt klage');
    }

    klage.status = KlagebehandlingStatus.MOTTATT_FRA_KLAGEINSTANS;
    klage.resultat = {
        ...klage.resultat,
        journalføringstidspunktInnstillingsbrev: '2025-04-05T10:00:00',
        distribusjonstidspunktInnstillingsbrev: '2025-04-06T10:00:00',
        oversendtKlageinstansenTidspunkt: '2025-04-07T10:00:00',
        klageinstanshendelser: [lagKlagebehandlingAvsluttetHendelse(utfall)],
    };
};

export const klageTestUtils = {
    saksnummer,
    sakId,
    klageId,
    fnr,
    navIdent,
    beslutterIdent,
    journalpostId,
    vedtakId,
    rammebehandlingId,
    omgjøringsbehandlingId,
    klageinstanshendelseId,
    søknadId,
    saksbehandler,
    personopplysninger,
    lagInitiellKlage,
    lagRammevedtak,
    lagRammebehandling,
    lagSøknad,
    lagOmgjøringsbehandling,
    lagSak,
    lagKlagebehandlingAvsluttetHendelse,
    skalAvvises,
    simulerSvarFraKlageinstans,
} as const;
