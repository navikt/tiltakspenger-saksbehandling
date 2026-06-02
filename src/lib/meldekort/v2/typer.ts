import { Periode } from '~/types/Periode';
import {
    MeldekortbehandlingId,
    MeldekortbehandlingStatus,
    MeldekortbehandlingType,
    MeldekortBeregning,
    MeldekortDagProps,
} from '~/lib/meldekort/typer/Meldekortbehandling';
import {
    BrukersMeldekortId,
    BrukersMeldekortKjedeStatus,
    BrukersMeldekortProps,
} from '~/lib/meldekort/typer/BrukersMeldekort';
import {
    MeldeperiodeBeregningProps,
    MeldeperiodeBeregningPropsV2,
} from '~/lib/beregning-og-simulering/typer/Beregning';
import {
    MeldeperiodeId,
    MeldeperiodeKjedeId,
    MeldeperiodeProps,
} from '~/lib/meldekort/typer/Meldeperiode';
import { SakId } from '~/lib/sak/SakTyper';
import { Nullable } from '~/types/UtilTypes';
import { Attestering } from '~/lib/behandling-felles/typer/Attestering';
import { KanIkkeIverksetteUtbetalingGrunn, Utbetalingsstatus } from '~/types/Utbetaling';
import { Avbrutt } from '~/lib/behandling-felles/typer/Avbrutt';
import { SimulertBeregning } from '~/lib/beregning-og-simulering/typer/SimulertBeregning';
import { TilbakekrevingId } from '~/lib/tilbakekreving/typer/Tilbakekreving';
import { VentestatusHendelse } from '~/types/Ventestatus';

export type MeldeperiodeKjedePropsV2 = {
    id: MeldeperiodeKjedeId;
    periode: Periode;
    tiltaksnavn: string[];
    sisteMeldeperiode: MeldeperiodeProps;
    meldekortbehandlingIder: MeldekortbehandlingId[];
    meldekortbehandlingStatus: MeldekortbehandlingStatus | null;
    brukersMeldekort: BrukersMeldekortProps[];
    brukersMeldekortStatus: BrukersMeldekortKjedeStatus;
    gjeldendeBeregning: MeldeperiodeBeregningProps | null;
};

export type MeldeperiodebehandlingProps = {
    meldeperiodeId: MeldeperiodeId;
    kjedeId: MeldeperiodeKjedeId;
    brukersMeldekortId: Nullable<BrukersMeldekortId>;
    periode: Periode;
    dager: MeldekortDagProps[];
    beregning: Nullable<MeldeperiodeBeregningPropsV2>;
};

export type MeldekortbehandlingPropsV2 = {
    id: MeldekortbehandlingId;
    sakId: SakId;
    meldeperioder: MeldeperiodebehandlingProps[];
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    opprettet: string;
    godkjentTidspunkt: Nullable<string>;
    status: MeldekortbehandlingStatus;
    erAvsluttet: boolean;
    navkontor: string;
    navkontorNavn: Nullable<string>;
    begrunnelse: Nullable<string>;
    type: MeldekortbehandlingType;
    attesteringer: Attestering[];
    utbetalingsstatus: Utbetalingsstatus;
    /** Sammenhengende totalperiode på tvers av alle meldeperioder */
    periode: Periode;
    beregning: Nullable<MeldekortBeregning>;
    avbrutt: Nullable<Avbrutt>;
    simulertBeregning: Nullable<SimulertBeregning>;
    kanIkkeIverksetteUtbetaling: Nullable<KanIkkeIverksetteUtbetalingGrunn>;
    tekstTilVedtaksbrev: Nullable<string>;
    tilbakekrevingId: Nullable<TilbakekrevingId>;
    skalSendeVedtaksbrev: boolean;
    ventestatus: VentestatusHendelse[];
};
