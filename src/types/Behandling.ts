import { ArenaTPVedtak } from './ArenaTPVedtak';

import { Periode } from './Periode';
import { Revurdering, RevurderingVedtakRequest } from './Revurdering';
import { SimulertBeregning } from './SimulertBeregningTypes';
import { Søknadsbehandling, SøknadsbehandlingVedtakRequest } from './Søknadsbehandling';
import { Tiltaksdeltagelse } from './TiltakDeltagelseTypes';
import { Utbetalingsstatus } from './Utbetaling';
import { Nullable } from './UtilTypes';
import { Ytelse } from './Ytelse';

export type BehandlingId = `beh_${string}`;

export enum BehandlingResultat {
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

export type Rammebehandling = Søknadsbehandling | Revurdering;

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
