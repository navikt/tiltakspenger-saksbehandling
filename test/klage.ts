import {
    Klagebehandling,
    KlagebehandlingResultat,
    KlagebehandlingsresultatAvvist,
    KlagebehandlingsresultatOmgjør,
    KlagebehandlingsresultatOpprettholdt,
    KlagebehandlingStatus,
    KlageFormkrav,
    KlageInnsendingskilde,
    OmgjøringÅrsak,
} from '~/lib/klage/typer/Klage';
import {
    BehandlingFeilregistrertHendelse,
    KlageHendelseFeilregistrertType,
    KlageHendelseKlagebehandlingAvsluttetUtfall,
    KlageHendelsestype,
    KlagebehandlingAvsluttetHendelse,
    Klageinstanshendelse,
    OmgjøringskravbehandlingAvsluttetHendelse,
    OmgjøringskravbehandlingAvsluttetUtfall,
} from '~/lib/klage/typer/Klageinstanshendelse';
import { VentestatusHendelse } from '~/lib/behandling-felles/typer/Ventestatus';
import { tilSaksnummer } from '~/lib/sak/Saksnummer';
import { ikkeSladdet } from '~test/sladdetVerdi';

export const formkrav = (overstyringer: Partial<KlageFormkrav> = {}): KlageFormkrav => ({
    vedtakDetKlagesPå: 'vedtak_1',
    erKlagerPartISaken: true,
    klagesDetPåKonkreteElementerIVedtaket: true,
    erKlagefristenOverholdt: true,
    erUnntakForKlagefrist: null,
    erKlagenSignert: true,
    innsendingsdato: '2025-04-01',
    innsendingskilde: KlageInnsendingskilde.DIGITAL,
    ...overstyringer,
});

export const klagebehandling = (overstyringer: Partial<Klagebehandling> = {}): Klagebehandling => ({
    id: 'klage_1',
    sakId: 'sak_1',
    saksnummer: tilSaksnummer('202501011001'),
    fnr: ikkeSladdet('12345678911'),
    opprettet: '2025-04-01T10:00:00',
    sistEndret: '2025-04-01T10:00:00',
    iverksattTidspunkt: null,
    saksbehandler: 'Z12345',
    klagensJournalpostId: '453827',
    klagensJournalpostOpprettet: '2025-04-01T10:00:00',
    status: KlagebehandlingStatus.UNDER_BEHANDLING,
    resultat: null,
    avbrutt: null,
    kanIverksetteVedtak: null,
    kanIverksetteOpprettholdelse: false,
    ventestatus: [],
    formkrav: formkrav(),
    tilknyttedeBehandlingIder: [],
    åpenBehandlingId: null,
    forvaltningsmelding: null,
    ...overstyringer,
});

export const avvistResultat = (
    overstyringer: Partial<KlagebehandlingsresultatAvvist> = {},
): KlagebehandlingsresultatAvvist => ({
    type: KlagebehandlingResultat.AVVIST,
    brevtekst: [],
    begrunnelseFerdigstilling: ikkeSladdet(null),
    ...overstyringer,
});

export const omgjørResultat = (
    overstyringer: Partial<KlagebehandlingsresultatOmgjør> = {},
): KlagebehandlingsresultatOmgjør => ({
    type: KlagebehandlingResultat.OMGJØR,
    årsak: OmgjøringÅrsak.FEIL_LOVANVENDELSE,
    begrunnelse: ikkeSladdet('Vedtaket bygger på feil lovanvendelse'),
    begrunnelseFerdigstilling: ikkeSladdet(null),
    ferdigstiltTidspunkt: null,
    ...overstyringer,
});

export const opprettholdtResultat = (
    overstyringer: Partial<KlagebehandlingsresultatOpprettholdt> = {},
): KlagebehandlingsresultatOpprettholdt => ({
    type: KlagebehandlingResultat.OPPRETTHOLDT,
    brevtekst: [],
    hjemler: [],
    iverksattOpprettholdelseTidspunkt: null,
    journalføringstidspunktInnstillingsbrev: null,
    distribusjonstidspunktInnstillingsbrev: null,
    oversendtKlageinstansenTidspunkt: null,
    klageinstanshendelser: [],
    ferdigstiltTidspunkt: null,
    journalpostIdInnstillingsbrev: null,
    dokumentInfoIder: null,
    begrunnelseFerdigstilling: ikkeSladdet(null),
    ...overstyringer,
});

export const ventestatus = (
    overstyringer: Partial<VentestatusHendelse> = {},
): VentestatusHendelse => ({
    sattPåVentAv: 'Z12345',
    tidspunkt: '2025-04-02T10:00:00',
    begrunnelse: ikkeSladdet('Venter på dokumentasjon'),
    erSattPåVent: true,
    frist: null,
    status: KlagebehandlingStatus.UNDER_BEHANDLING,
    ...overstyringer,
});

const hendelseBase = (hendelsestype: KlageHendelsestype): Klageinstanshendelse => ({
    klagehendelseId: 'klagehendelse_1',
    klagebehandlingId: 'klage_1',
    opprettet: '2025-06-01T10:00:00',
    sistEndret: '2025-06-01T10:00:00',
    eksternKlagehendelseId: 'ekstern_1',
    avsluttetTidspunkt: '2025-06-01T10:00:00',
    journalpostreferanser: [],
    hendelsestype,
});

export const klagebehandlingAvsluttetHendelse = (
    utfall: KlageHendelseKlagebehandlingAvsluttetUtfall,
): KlagebehandlingAvsluttetHendelse => ({
    ...hendelseBase(KlageHendelsestype.KLAGEBEHANDLING_AVSLUTTET),
    utfall,
});

export const omgjøringskravbehandlingAvsluttetHendelse = (
    utfall: OmgjøringskravbehandlingAvsluttetUtfall,
): OmgjøringskravbehandlingAvsluttetHendelse => ({
    ...hendelseBase(KlageHendelsestype.OMGJØRINGSKRAVBEHANDLING_AVSLUTTET),
    utfall,
});

export const behandlingFeilregistrertHendelse = (
    type: KlageHendelseFeilregistrertType,
): BehandlingFeilregistrertHendelse => ({
    ...hendelseBase(KlageHendelsestype.BEHANDLING_FEILREGISTRERT),
    feilregistrertTidspunkt: '2025-06-01T10:00:00',
    årsak: 'Feilregistrert hos klageinstansen',
    navIdent: 'Z99999',
    type,
});
