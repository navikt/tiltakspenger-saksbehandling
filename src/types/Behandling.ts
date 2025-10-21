import { ArenaTPVedtak } from './ArenaTPVedtak';
import { Attestering } from './Attestering';
import { Avbrutt } from './Avbrutt';
import { Barnetillegg } from './Barnetillegg';

import { Periode } from './Periode';
import { RevurderingVedtakRequest } from './Revurdering';
import { SakId } from './Sak';
import { SimulertBeregning } from './SimulertBeregningTypes';
import { SøknadsbehandlingVedtakRequest } from './Søknadsbehandling';
import { Tiltaksdeltagelse } from './TiltakDeltagelseTypes';
import { Utbetalingsstatus } from './Utbetaling';
import { Nullable } from './UtilTypes';
import { Ytelse } from './Ytelse';

export type BehandlingId = `beh_${string}`;

export enum BehandlingResultat {
    AVSLAG = 'AVSLAG',
    INNVILGELSE = 'INNVILGELSE',
    IKKE_VALGT = 'IKKE_VALGT',
    STANS = 'STANS',
    REVURDERING_INNVILGELSE = 'REVURDERING_INNVILGELSE',
}

export enum Behandlingstype {
    SØKNAD = 'SØKNAD',
    SØKNADSBEHANDLING = 'SØKNADSBEHANDLING',
    REVURDERING = 'REVURDERING',
}

export enum Behandlingsstatus {
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
    behandlingStatus: Behandlingsstatus;
};

export type BehandlingUtbetalingProps = {
    navkontor: string;
    navkontorNavn?: string;
    status: Utbetalingsstatus;
    simulertBeregning: SimulertBeregning;
};

export interface Behandling {
    id: BehandlingId;
    type: Behandlingstype;
    status: Behandlingsstatus;
    resultat: Nullable<BehandlingResultat>;
    sakId: SakId;
    saksnummer: string;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    saksopplysninger: Nullable<Saksopplysninger>;
    attesteringer: Attestering[];
    virkningsperiode: Nullable<Periode>;
    fritekstTilVedtaksbrev: Nullable<string>;
    begrunnelseVilkårsvurdering: Nullable<string>;
    avbrutt: Nullable<Avbrutt>;
    sistEndret: string;
    iverksattTidspunkt: Nullable<string>;
    ventestatus: Nullable<VentestatusHendelse>;
    utbetaling: Nullable<BehandlingUtbetalingProps>;
    barnetillegg: Nullable<Barnetillegg>;
}

export type Saksopplysninger = {
    fødselsdato: string;
    tiltaksdeltagelse: Tiltaksdeltagelse[];
    saksopplysningsperiode: Periode;
    ytelser: Ytelse[];
    tiltakspengevedtakFraArena: ArenaTPVedtak[];
};

export type BehandlingVedtak = SøknadsbehandlingVedtakRequest | RevurderingVedtakRequest;

export interface OppdaterBehandlingRequest {
    resultat: Nullable<BehandlingResultat>;
    fritekstTilVedtaksbrev: Nullable<string>;
    begrunnelseVilkårsvurdering: Nullable<string>;
}
