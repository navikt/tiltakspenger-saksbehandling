import { Periode } from '../../../types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { SakId } from '~/lib/sak/SakTyper';
import { UtbetalingId } from '~/types/Utbetaling';
import { BeregningKilde } from '~/lib/beregning-og-simulering/typer/Beregning';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';

export type TilbakekrevingId = `tilbakekreving_${string}`;

export interface TilbakekrevingBehandling {
    id: TilbakekrevingId;
    sakId: SakId;
    utbetalingId: UtbetalingId;
    beregningKilde: BeregningKilde;
    tilbakeBehandlingId: string;
    opprettet: string;
    sistEndret: string;
    status: TilbakekrevingBehandlingsstatus;
    url: string;
    kravgrunnlagTotalPeriode: Periode;
    totaltFeilutbetaltBeløp: number;
    varselSendt: Nullable<string>;
    saksbehandler: Nullable<string>;
    beslutter: Nullable<string>;
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
}

export enum TilbakekrevingBehandlingsstatus {
    OPPRETTET = 'OPPRETTET',
    TIL_BEHANDLING = 'TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    TIL_GODKJENNING = 'TIL_GODKJENNING',
    UNDER_GODKJENNING = 'UNDER_GODKJENNING',
    AVSLUTTET = 'AVSLUTTET',
}
