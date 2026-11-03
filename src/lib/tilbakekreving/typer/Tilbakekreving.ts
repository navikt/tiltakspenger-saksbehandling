import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { SakId } from '~/lib/sak/SakTyper';
import { UtbetalingId } from '~/lib/_felles/utbetaling/utbetalingTyper';
import { BeregningKilde } from '~/lib/beregning-og-simulering/typer/Beregning';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { Dato, Tidspunkt } from '~/types/DatoTid';

export type TilbakekrevingId = `tilbakekreving_${string}`;

export interface TilbakekrevingBehandling {
    id: TilbakekrevingId;
    sakId: SakId;
    utbetalingId: UtbetalingId;
    beregningKilde: BeregningKilde;
    tilbakeBehandlingId: string;
    opprettet: Tidspunkt;
    sistEndret: Tidspunkt;
    status: TilbakekrevingBehandlingsstatus;
    /** Lenke til behandlingen i tilbakekrevingsløsningen. Er null dersom saksbehandler mangler tilbakekrevingsrollen. */
    url: Nullable<string>;
    kravgrunnlagTotalPeriode: Periode;
    totaltFeilutbetaltBeløp: number;
    varselSendt: Nullable<Dato>;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
    venter: Nullable<TilbakekrevingVenter>;
}

export enum TilbakekrevingBehandlingsstatus {
    OPPRETTET = 'OPPRETTET',
    TIL_FORHÅNDSVARSEL = 'TIL_FORHÅNDSVARSEL',
    UNDER_FORHÅNDSVARSLING = 'UNDER_FORHÅNDSVARSLING',
    TIL_BEHANDLING = 'TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    TIL_GODKJENNING = 'TIL_GODKJENNING',
    UNDER_GODKJENNING = 'UNDER_GODKJENNING',
    AVSLUTTET = 'AVSLUTTET',
}

export type TilbakekrevingVenter = {
    grunn: TilbakekrevingVentegrunn;
    gjenopptas: Dato;
};

export enum TilbakekrevingVentegrunn {
    AVVENTER_BRUKERUTTALELSE = 'AVVENTER_BRUKERUTTALELSE',
}
