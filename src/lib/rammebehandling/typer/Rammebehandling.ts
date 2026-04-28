import { ArenaTPVedtak } from './ArenaTPVedtak';
import { Periode } from '../../../types/Periode';
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
import { Tiltaksdeltakelse } from './Tiltaksdeltakelse';
import { BehandlingUtbetalingProps, Utbetalingskontroll } from '../../../types/Utbetaling';
import { Nullable } from '../../../types/UtilTypes';
import { Ytelse } from './Ytelse';
import { SakId } from '~/lib/sak/SakTyper';
import { Attestering } from '~/lib/behandling-felles/typer/Attestering';
import { Avbrutt } from '~/lib/behandling-felles/typer/Avbrutt';
import { Rammevedtak, VedtakId } from '~/lib/rammebehandling/typer/Rammevedtak';
import { KlageId } from '../../klage/typer/Klage';
import { VentestatusHendelse } from '../../../types/Ventestatus';
import { TilbakekrevingId } from '~/lib/tilbakekreving/typer/Tilbakekreving';

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
    opprettet: string;
    sistEndret: string;
    iverksattTidspunkt: Nullable<string>;
    ventestatus: VentestatusHendelse[];
    utbetaling: Nullable<BehandlingUtbetalingProps>;
    utbetalingskontroll: Nullable<Utbetalingskontroll>;
    klagebehandlingId: Nullable<KlageId>;
    tilbakekrevingId: Nullable<TilbakekrevingId>;
    skalSendeVedtaksbrev: boolean;
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
