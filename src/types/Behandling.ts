import { ArenaTPVedtak } from './ArenaTPVedtak';
import { Periode } from './Periode';
import {
    Revurdering,
    RevurderingInnvilgelse,
    RevurderingOmgjøring,
    RevurderingVedtakRequest,
} from './Revurdering';
import { SimulertBeregning } from './SimulertBeregningTypes';
import {
    Søknadsbehandling,
    SøknadsbehandlingInnvilgelse,
    SøknadsbehandlingVedtakRequest,
} from './Søknadsbehandling';
import { Tiltaksdeltagelse } from './TiltakDeltagelseTypes';
import { Utbetalingsstatus } from './Utbetaling';
import { Nullable } from './UtilTypes';
import { Ytelse } from './Ytelse';
import { SakId } from '~/types/Sak';
import { Attestering } from '~/types/Attestering';
import { Avbrutt } from '~/types/Avbrutt';
import { VedtakId } from '~/types/Vedtak';

export type BehandlingId = `beh_${string}`;

export interface RammebehandlingBase {
    id: BehandlingId;
    type: Behandlingstype;
    status: Rammebehandlingsstatus;
    resultat: RammebehandlingResultat;
    sakId: SakId;
    saksnummer: string;
    rammevedtakId: Nullable<VedtakId>;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    saksopplysninger: Saksopplysninger;
    attesteringer: Attestering[];
    virkningsperiode: Nullable<Periode>;
    fritekstTilVedtaksbrev: Nullable<string>;
    begrunnelseVilkårsvurdering: Nullable<string>;
    avbrutt: Nullable<Avbrutt>;
    sistEndret: string;
    iverksattTidspunkt: Nullable<string>;
    ventestatus: Nullable<VentestatusHendelse>;
    utbetaling: Nullable<BehandlingUtbetalingProps>;
}

export type Rammebehandling = Søknadsbehandling | Revurdering;

export enum RammebehandlingResultat {
    INNVILGELSE = 'INNVILGELSE',
    AVSLAG = 'AVSLAG',
    STANS = 'STANS',
    REVURDERING_INNVILGELSE = 'REVURDERING_INNVILGELSE',
    OMGJØRING = 'OMGJØRING',
    IKKE_VALGT = 'IKKE_VALGT',
}

export enum Behandlingstype {
    SØKNAD = 'SØKNAD',
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

export type VentestatusHendelse = {
    sattPåVentAv: string;
    tidspunkt: string;
    begrunnelse: string;
    erSattPåVent: boolean;
    behandlingStatus: Rammebehandlingsstatus;
};

export type BehandlingUtbetalingProps = {
    navkontor: string;
    navkontorNavn?: string;
    status: Utbetalingsstatus;
    simulertBeregning: SimulertBeregning;
};

export type Saksopplysninger = {
    fødselsdato: string;
    tiltaksdeltagelse: Tiltaksdeltagelse[];
    periode: Nullable<Periode>;
    ytelser: Ytelse[];
    tiltakspengevedtakFraArena: ArenaTPVedtak[];
};

export type RammebehandlingVedtakRequest =
    | SøknadsbehandlingVedtakRequest
    | RevurderingVedtakRequest;

export interface OppdaterBehandlingRequestBase {
    resultat: RammebehandlingResultat;
    fritekstTilVedtaksbrev: Nullable<string>;
    begrunnelseVilkårsvurdering: Nullable<string>;
}

export type RammebehandlingMedInnvilgelse =
    | SøknadsbehandlingInnvilgelse
    | RevurderingInnvilgelse
    | RevurderingOmgjøring;
