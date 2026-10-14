import { ArenaTPVedtak } from './ArenaTPVedtak';
import { Periode } from '~/types/Periode';
import {
    Revurdering,
    RevurderingInnvilgelse,
    OmgjøringInnvilgelse,
    RevurderingResultat,
    OppdaterRevurderingDTO,
} from './Revurdering';
import {
    Søknadsbehandling,
    SøknadsbehandlingInnvilgelse,
    SøknadsbehandlingResultat,
    OppdaterSøknadsbehandlingDTO,
} from './Søknadsbehandling';
import { Tiltaksdeltakelse, TiltaksdeltakelseSomFratarRett } from './Tiltaksdeltakelse';
import {
    BehandlingUtbetalingProps,
    Utbetalingskontroll,
} from '~/lib/_felles/utbetaling/utbetalingTyper';
import { Nullable } from '~/types/UtilTypes';
import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { Ytelse } from './Ytelse';
import { SakId } from '~/lib/sak/SakTyper';
import { Attestering } from '~/lib/behandling-felles/typer/Attestering';
import { Avbrutt } from '~/lib/behandling-felles/typer/Avbrutt';
import { VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import { KlageId } from '../../klage/typer/Klage';
import { VentestatusHendelse } from '~/lib/behandling-felles/typer/Ventestatus';
import { TilbakekrevingId } from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Saksnummer } from '~/lib/sak/Saksnummer';
import {
    OppdaterPrioriteringDTO,
    Prioritering,
} from '~/lib/_felles/prioritering/prioriteringTyper';

export const RammebehandlingIdPrefix = 'beh_' as const;
export type RammebehandlingId = `${typeof RammebehandlingIdPrefix}${string}`;

export interface RammebehandlingBase {
    id: RammebehandlingId;
    type: Rammebehandlingstype;
    status: Rammebehandlingsstatus;
    resultat: RammebehandlingResultat;
    sakId: SakId;
    saksnummer: Saksnummer;
    rammevedtakId: Nullable<VedtakId>;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    saksopplysninger: Saksopplysninger;
    attesteringer: Attestering[];
    vedtaksperiode: Nullable<Periode>;
    fritekstTilVedtaksbrev: SladdbarVerdi<Nullable<string>>;
    begrunnelseVilkårsvurdering: SladdbarVerdi<Nullable<string>>;
    avbrutt: Nullable<Avbrutt>;
    opprettet: string;
    sistEndret: string;
    iverksattTidspunkt: Nullable<string>;
    ventestatus: VentestatusHendelse[];
    utbetaling: Nullable<BehandlingUtbetalingProps>;
    utbetalingskontroll: Nullable<Utbetalingskontroll>;
    klagebehandlingId: Nullable<KlageId>;
    tilbakekrevingId: Nullable<TilbakekrevingId>;
    skalSendeVedtaksbrev: boolean;
    skalJournalføreNotat: boolean;
    /** Prioriterte behandlinger ligger alltid øverst i benken. */
    prioritering: Nullable<Prioritering>;
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
    /** Hvorfor en automatisk behandling ble overlatt til en saksbehandler. */
    manueltBehandlesGrunner?: ManueltBehandlesGrunn[];
}

export type Rammebehandling = Søknadsbehandling | Revurdering;

export type RammebehandlingResultat = SøknadsbehandlingResultat | RevurderingResultat;

export enum Rammebehandlingstype {
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
}

export enum Rammebehandlingsstatus {
    UNDER_AUTOMATISK_BEHANDLING = 'UNDER_AUTOMATISK_BEHANDLING',
    KLAR_TIL_BEHANDLING = 'KLAR_TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    KLAR_TIL_BESLUTNING = 'KLAR_TIL_BESLUTNING',
    UNDER_BESLUTNING = 'UNDER_BESLUTNING',
    VEDTATT = 'VEDTATT',
    AVBRUTT = 'AVBRUTT',
}

export enum ManueltBehandlesGrunn {
    SOKNAD_HAR_ANDRE_YTELSER = 'SOKNAD_HAR_ANDRE_YTELSER',
    SOKNAD_HAR_LAGT_TIL_BARN_MANUELT = 'SOKNAD_HAR_LAGT_TIL_BARN_MANUELT',
    SOKNAD_BARN_UTENFOR_EOS = 'SOKNAD_BARN_UTENFOR_EOS',
    SOKNAD_BARN_FYLLER_16_I_SOKNADSPERIODEN = 'SOKNAD_BARN_FYLLER_16_I_SOKNADSPERIODEN',
    SOKNAD_BARN_FODT_I_SOKNADSPERIODEN = 'SOKNAD_BARN_FODT_I_SOKNADSPERIODEN',
    SOKNAD_HAR_KVP = 'SOKNAD_HAR_KVP',
    SOKNAD_INTRO = 'SOKNAD_INTRO',
    SOKNAD_INSTITUSJONSOPPHOLD = 'SOKNAD_INSTITUSJONSOPPHOLD',

    SAKSOPPLYSNING_FANT_IKKE_TILTAK = 'SAKSOPPLYSNING_FANT_IKKE_TILTAK',
    SAKSOPPLYSNING_TILTAK_MANGLER_PERIODE = 'SAKSOPPLYSNING_TILTAK_MANGLER_PERIODE',
    SAKSOPPLYSNING_TILTAK_MANGLER_DELTAKELSESMENGDE = 'SAKSOPPLYSNING_TILTAK_MANGLER_DELTAKELSESMENGDE',
    SAKSOPPLYSNING_TILTAK_MER_ENN_FEM_DAGER_PER_UKE = 'SAKSOPPLYSNING_TILTAK_MER_ENN_FEM_DAGER_PER_UKE',
    SAKSOPPLYSNING_DELTIDSTILTAK_UTEN_DAGER_PER_UKE = 'SAKSOPPLYSNING_DELTIDSTILTAK_UTEN_DAGER_PER_UKE',
    SAKSOPPLYSNING_OVERLAPPENDE_TILTAK = 'SAKSOPPLYSNING_OVERLAPPENDE_TILTAK',
    SAKSOPPLYSNING_MINDRE_ENN_14_DAGER_MELLOM_TILTAK_OG_SOKNAD = 'SAKSOPPLYSNING_MINDRE_ENN_14_DAGER_MELLOM_TILTAK_OG_SOKNAD',
    SAKSOPPLYSNING_HAR_LONNSTILSKUDD = 'SAKSOPPLYSNING_HAR_LONNSTILSKUDD',
    SAKSOPPLYSNING_HAR_TILTAK_SOM_FRATAR_RETT = 'SAKSOPPLYSNING_HAR_TILTAK_SOM_FRATAR_RETT',
    SAKSOPPLYSNING_ULIK_TILTAKSPERIODE = 'SAKSOPPLYSNING_ULIK_TILTAKSPERIODE',
    SAKSOPPLYSNING_HAR_IKKE_DELTATT_PA_TILTAK = 'SAKSOPPLYSNING_HAR_IKKE_DELTATT_PA_TILTAK',
    SAKSOPPLYSNING_ANDRE_YTELSER = 'SAKSOPPLYSNING_ANDRE_YTELSER',
    SAKSOPPLYSNING_VEDTAK_I_ARENA = 'SAKSOPPLYSNING_VEDTAK_I_ARENA',
    SAKSOPPLYSNING_MANGLER_FULLSTENDIG_PERIODE = 'SAKSOPPLYSNING_MANGLER_FULLSTENDIG_PERIODE',

    STANS_FANT_IKKE_TILTAKSDELTAKELSE = 'STANS_FANT_IKKE_TILTAKSDELTAKELSE',
    STANS_DELTAKELSEN_ER_IKKE_AVSLUTTET = 'STANS_DELTAKELSEN_ER_IKKE_AVSLUTTET',
    STANS_DELTAKELSEN_MANGLER_SLUTTDATO = 'STANS_DELTAKELSEN_MANGLER_SLUTTDATO',
    STANS_SLUTTDATO_ER_IKKE_PASSERT = 'STANS_SLUTTDATO_ER_IKKE_PASSERT',
    STANS_INGEN_INNVILGEDE_DAGER_ETTER_SLUTTDATO = 'STANS_INGEN_INNVILGEDE_DAGER_ETTER_SLUTTDATO',
    STANS_INGEN_INNVILGEDE_DAGER_ETTER_SISTE_UTBETALING = 'STANS_INGEN_INNVILGEDE_DAGER_ETTER_SISTE_UTBETALING',
    STANS_ANDRE_DELTAKELSER_INNVILGET_ETTER_SLUTTDATO = 'STANS_ANDRE_DELTAKELSER_INNVILGET_ETTER_SLUTTDATO',
    STANS_UTBETALING_SIMULERING_MANGLER = 'STANS_UTBETALING_SIMULERING_MANGLER',
    STANS_UTBETALING_STOTTER_IKKE_FEILUTBETALING = 'STANS_UTBETALING_STOTTER_IKKE_FEILUTBETALING',
    STANS_UTBETALING_STOTTER_IKKE_JUSTERING = 'STANS_UTBETALING_STOTTER_IKKE_JUSTERING',
    STANS_UTBETALING_KONTROLLSIMULERING_HAR_ENDRINGER = 'STANS_UTBETALING_KONTROLLSIMULERING_HAR_ENDRINGER',
    STANS_KAN_IKKE_FYLLES_UT = 'STANS_KAN_IKKE_FYLLES_UT',
    STANS_UGYLDIGE_MELDEPERIODER_FOR_HELG = 'STANS_UGYLDIGE_MELDEPERIODER_FOR_HELG',
    STANS_KAN_IKKE_SENDES_TIL_BESLUTNING = 'STANS_KAN_IKKE_SENDES_TIL_BESLUTNING',

    FORLENGELSE_FANT_IKKE_GJELDENDE_VEDTAK = 'FORLENGELSE_FANT_IKKE_GJELDENDE_VEDTAK',
    FORLENGELSE_VEDTAKET_ER_STANSET_ELLER_OPPHORT = 'FORLENGELSE_VEDTAKET_ER_STANSET_ELLER_OPPHORT',
    FORLENGELSE_INNVILGELSEN_SLUTTER_FOR_DELTAKELSEN = 'FORLENGELSE_INNVILGELSEN_SLUTTER_FOR_DELTAKELSEN',
    FORLENGELSE_FANT_IKKE_TILTAKSDELTAKELSE = 'FORLENGELSE_FANT_IKKE_TILTAKSDELTAKELSE',
    FORLENGELSE_DELTAKELSEN_HAR_UGYLDIG_STATUS = 'FORLENGELSE_DELTAKELSEN_HAR_UGYLDIG_STATUS',
    FORLENGELSE_TILTAKET_GIR_IKKE_RETT = 'FORLENGELSE_TILTAKET_GIR_IKKE_RETT',
    FORLENGELSE_DELTAKELSEN_MANGLER_SLUTTDATO = 'FORLENGELSE_DELTAKELSEN_MANGLER_SLUTTDATO',
    FORLENGELSE_SLUTTDATO_ER_IKKE_ETTER_INNVILGELSEN = 'FORLENGELSE_SLUTTDATO_ER_IKKE_ETTER_INNVILGELSEN',
    FORLENGELSE_ENDRET_STARTDATO = 'FORLENGELSE_ENDRET_STARTDATO',
    FORLENGELSE_ENDRET_DELTAKELSESMENGDE_OG_KAN_MELDE_I_HELG = 'FORLENGELSE_ENDRET_DELTAKELSESMENGDE_OG_KAN_MELDE_I_HELG',
    FORLENGELSE_KAN_IKKE_UTLEDE_DELTAKELSESMENGDE = 'FORLENGELSE_KAN_IKKE_UTLEDE_DELTAKELSESMENGDE',
    FORLENGELSE_DELTAKELSESMENGDE_GIR_IKKE_HELE_DAGER = 'FORLENGELSE_DELTAKELSESMENGDE_GIR_IKKE_HELE_DAGER',
    FORLENGELSE_KAN_IKKE_UTLEDE_BARNETILLEGG = 'FORLENGELSE_KAN_IKKE_UTLEDE_BARNETILLEGG',
    FORLENGELSE_OVERLAPPER_ANDRE_VEDTAK = 'FORLENGELSE_OVERLAPPER_ANDRE_VEDTAK',
    FORLENGELSE_OVERLAPPENDE_TILTAK = 'FORLENGELSE_OVERLAPPENDE_TILTAK',
    FORLENGELSE_ANDRE_YTELSER = 'FORLENGELSE_ANDRE_YTELSER',
    FORLENGELSE_VEDTAK_I_ARENA = 'FORLENGELSE_VEDTAK_I_ARENA',
    FORLENGELSE_UTBETALING_SIMULERING_MANGLER = 'FORLENGELSE_UTBETALING_SIMULERING_MANGLER',
    FORLENGELSE_UTBETALING_STOTTER_IKKE_FEILUTBETALING = 'FORLENGELSE_UTBETALING_STOTTER_IKKE_FEILUTBETALING',
    FORLENGELSE_UTBETALING_STOTTER_IKKE_JUSTERING = 'FORLENGELSE_UTBETALING_STOTTER_IKKE_JUSTERING',
    FORLENGELSE_UTBETALING_KONTROLLSIMULERING_HAR_ENDRINGER = 'FORLENGELSE_UTBETALING_KONTROLLSIMULERING_HAR_ENDRINGER',
    FORLENGELSE_KAN_IKKE_FYLLES_UT = 'FORLENGELSE_KAN_IKKE_FYLLES_UT',
    FORLENGELSE_UGYLDIGE_MELDEPERIODER_FOR_HELG = 'FORLENGELSE_UGYLDIGE_MELDEPERIODER_FOR_HELG',
    FORLENGELSE_KAN_IKKE_SENDES_TIL_BESLUTNING = 'FORLENGELSE_KAN_IKKE_SENDES_TIL_BESLUTNING',

    ANNET_APEN_BEHANDLING = 'ANNET_APEN_BEHANDLING',
    ANNET_VEDTAK_FOR_SAMME_PERIODE = 'ANNET_VEDTAK_FOR_SAMME_PERIODE',
    ANNET_HAR_SOKT_FOR_SENT = 'ANNET_HAR_SOKT_FOR_SENT',
    ANNET_ER_UNDER_18_I_SOKNADSPERIODEN = 'ANNET_ER_UNDER_18_I_SOKNADSPERIODEN',
}

export type Saksopplysninger = {
    fødselsdato: SladdbarVerdi<string>;
    tiltaksdeltagelse: Tiltaksdeltakelse[];
    tiltaksdeltakelserSomFratarRett: TiltaksdeltakelseSomFratarRett[];
    periode: Nullable<Periode>;
    ytelser: Ytelse[];
    tiltakspengevedtakFraArena: ArenaTPVedtak[];
    oppslagstidspunkt: string;
};

export type OppdaterBehandlingDTO = OppdaterSøknadsbehandlingDTO | OppdaterRevurderingDTO;

/** Sendes til backenden, og har derfor aldri sladdede verdier. */
export type OppdaterBehandlingBaseDTO = {
    resultat: RammebehandlingResultat;
    fritekstTilVedtaksbrev: Nullable<string>;
    begrunnelseVilkårsvurdering: Nullable<string>;
    skalJournalføreNotat: boolean;
    prioritering: Nullable<OppdaterPrioriteringDTO>;
};

export type RammebehandlingMedInnvilgelse =
    SøknadsbehandlingInnvilgelse | RevurderingInnvilgelse | OmgjøringInnvilgelse;

export type RammebehandlingResultatMedInnvilgelse = RammebehandlingMedInnvilgelse['resultat'];
