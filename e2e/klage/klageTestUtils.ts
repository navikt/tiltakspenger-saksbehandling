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
import type { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';
import type { Rammevedtak, VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import {
    KlageHendelseKlagebehandlingAvsluttetUtfall,
    KlageHendelsestype,
} from '~/lib/klage/typer/Klageinstanshendelse';
import type {
    KlagebehandlingAvsluttetHendelse,
    KlageinstanshendelseId,
} from '~/lib/klage/typer/Klageinstanshendelse';

export const saksnummer = '10001';
export const sakId = 'sak_01ABC' as SakId;
export const klageId = 'klage_01ABC' as KlageId;
export const fnr = '12345678911';
export const navIdent = 'Z12345';
export const beslutterIdent = 'Z99999';
export const journalpostId = '453827';
export const vedtakId = 'vedtak_01ABC' as VedtakId;
export const rammebehandlingId = 'beh_01ABC' as RammebehandlingId;
export const klageinstanshendelseId = 'klagehendelse_01ABC' as KlageinstanshendelseId;

export const lagInitiellKlage = (): Klagebehandling => ({
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

export const lagRammevedtak = (): Rammevedtak => ({
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

export const lagRammebehandling = (): RevurderingStans => ({
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

export const lagSak = (klage: Klagebehandling | null): SakProps => ({
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
    søknader: [],
    tilbakekrevinger: [],
    kanSendeInnHelgForMeldekort: false,
    meldekortvedtak: [],
    meldekortbehandlinger: {},
    meldeperiodeKjederV2: [],
    åpenMeldekortbehandlingId: null,
});

export const saksbehandler: Saksbehandler = {
    brukernavn: 'Test Testesen',
    epost: 'test.testesen@nav.no',
    navIdent,
    roller: [SaksbehandlerRolle.SAKSBEHANDLER, SaksbehandlerRolle.BESLUTTER],
};

export const personopplysninger: Personopplysninger = {
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
export const skalAvvises = (formkrav: OppdaterKlageFormkravRequest): boolean =>
    !(
        formkrav.vedtakDetKlagesPå !== null &&
        formkrav.erKlagerPartISaken &&
        formkrav.klagesDetPåKonkreteElementerIVedtaket &&
        formkrav.erKlagefristenOverholdt &&
        formkrav.erKlagenSignert
    );

export const lagKlagebehandlingAvsluttetHendelse = (
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
export const simulerSvarFraKlageinstans = (
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
