import { ArenaTPVedtak } from './ArenaTPVedtak';
import { Periode } from './Periode';
import {
    Revurdering,
    RevurderingInnvilgelse,
    OmgjøringInnvilgelse,
    RevurderingResultat,
    OppdaterRevurderingDTO,
} from './Revurdering';
import { SimulertBeregning } from './SimulertBeregning';
import {
    Søknadsbehandling,
    SøknadsbehandlingInnvilgelse,
    SøknadsbehandlingResultat,
    OppdaterSøknadsbehandlingDTO,
} from './Søknadsbehandling';
import { Tiltaksdeltakelse } from './TiltakDeltakelse';
import { Utbetalingsstatus } from './Utbetaling';
import { Nullable } from './UtilTypes';
import { Ytelse } from './Ytelse';
import { SakId } from '~/types/Sak';
import { Attestering } from '~/types/Attestering';
import { Avbrutt } from '~/types/Avbrutt';
import { Rammevedtak, VedtakId } from '~/types/Rammevedtak';
import { KlageId } from './Klage';
import { VentestatusHendelse } from './Ventestatus';

export type BehandlingId = `beh_${string}`;

export interface RammebehandlingBase {
    id: BehandlingId;
    type: Rammebehandlingstype;
    status: Rammebehandlingsstatus;
    resultat: RammebehandlingResultat;
    sakId: SakId;
    saksnummer: string;
    rammevedtakId: Nullable<VedtakId>;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    saksopplysninger: Saksopplysninger;
    attesteringer: Attestering[];
    vedtaksperiode: Nullable<Periode>;
    fritekstTilVedtaksbrev: Nullable<string>;
    begrunnelseVilkårsvurdering: Nullable<string>;
    avbrutt: Nullable<Avbrutt>;
    sistEndret: string;
    iverksattTidspunkt: Nullable<string>;
    ventestatus: Nullable<VentestatusHendelse>;
    utbetaling: Nullable<BehandlingUtbetalingProps>;
    klagebehandlingId: Nullable<KlageId>;
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

export type BehandlingUtbetalingProps = {
    navkontor: string;
    navkontorNavn?: string;
    status: Utbetalingsstatus;
    simulertBeregning: SimulertBeregning;
};

export type Saksopplysninger = {
    fødselsdato: string;
    tiltaksdeltagelse: Tiltaksdeltakelse[];
    periode: Nullable<Periode>;
    ytelser: Ytelse[];
    tiltakspengevedtakFraArena: ArenaTPVedtak[];
    oppslagstidspunkt: string;
};

export type OppdaterBehandlingDTO = OppdaterSøknadsbehandlingDTO | OppdaterRevurderingDTO;

export type OppdaterBehandlingBaseDTO = {
    resultat: RammebehandlingResultat;
    fritekstTilVedtaksbrev: Nullable<string>;
    begrunnelseVilkårsvurdering: Nullable<string>;
};

export type RammebehandlingMedInnvilgelse =
    | SøknadsbehandlingInnvilgelse
    | RevurderingInnvilgelse
    | OmgjøringInnvilgelse;

export type RammebehandlingResultatMedInnvilgelse = RammebehandlingMedInnvilgelse['resultat'];

export type VedtattRammevedtakMedBehandling = { type: 'rammevedtak' } & Rammevedtak & {
        behandling: Rammebehandling;
    };
