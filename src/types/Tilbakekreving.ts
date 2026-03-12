import { Periode } from './Periode';
import { Nullable } from '~/types/UtilTypes';
import { SakId } from '~/types/Sak';
import { UtbetalingId } from '~/types/Utbetaling';

export type TilbakekrevingId = `tilbakekreving_${string}`;

export interface TilbakekrevingBehandling {
    id: TilbakekrevingId;
    sakId: SakId;
    utbetalingId: UtbetalingId;
    tilbakeBehandlingId: string;
    opprettet: string;
    sistEndret: string;
    status: TilbakekrevingBehandlingsstatus;
    url: string;
    kravgrunnlagTotalPeriode: Periode;
    totaltFeilutbetaltBeløp: number;
    varselSendt: Nullable<string>;
}

export enum TilbakekrevingBehandlingsstatus {
    OPPRETTET = 'OPPRETTET',
    TIL_BEHANDLING = 'TIL_BEHANDLING',
    TIL_GODKJENNING = 'TIL_GODKJENNING',
    AVSLUTTET = 'AVSLUTTET',
}
