import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { BenkV2BehandlingBase, BenkV2Behandlingstype, BenkV2Request } from './felles';
import { TilbakekrevingId } from '~/lib/tilbakekreving/typer/Tilbakekreving';

/**
 * Tilbakekreving har en egen saksbehandlingsflyt, og derfor egne statuser
 * (speiler TilbakekrevingBehandlingsstatus, uten avsluttede behandlinger).
 */
export enum BenkTilbakekrevingStatus {
    OPPRETTET = 'OPPRETTET',
    TIL_FORHÅNDSVARSEL = 'TIL_FORHÅNDSVARSEL',
    UNDER_FORHÅNDSVARSLING = 'UNDER_FORHÅNDSVARSLING',
    TIL_BEHANDLING = 'TIL_BEHANDLING',
    UNDER_BEHANDLING = 'UNDER_BEHANDLING',
    TIL_GODKJENNING = 'TIL_GODKJENNING',
    UNDER_GODKJENNING = 'UNDER_GODKJENNING',
}

export enum BenkTilbakekrevingKilde {
    RAMMEVEDTAK = 'RAMMEVEDTAK',
    MELDEKORT = 'MELDEKORT',
}

export type BenkTilbakekreving = BenkV2BehandlingBase & {
    type: BenkV2Behandlingstype.TILBAKEKREVING;
    id: TilbakekrevingId;
    status: BenkTilbakekrevingStatus;
    beløp: number;
    kilde: BenkTilbakekrevingKilde;
    kravgrunnlagPeriode: Periode;
    /** Lenke til behandlingen i tilbakekrevingsløsningen */
    url: string;
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
};

export enum BenkTilbakekrevingKolonne {
    fnr = 'fnr',
    beløp = 'beløp',
    kilde = 'kilde',
    status = 'status',
    startet = 'startet',
    sistEndret = 'sist_endret',
    saksbehandler = 'saksbehandler',
}

export type BenkTilbakekrevingFilter = {
    status: Nullable<BenkTilbakekrevingStatus>;
    kilde: Nullable<BenkTilbakekrevingKilde>;
    saksbehandler: Nullable<string | 'IKKE_TILDELT'>;
    kunOverMinstebeløp: boolean;
    skjulPåVent: boolean;
};

export type BenkTilbakekrevingRequest = BenkV2Request<
    BenkTilbakekrevingFilter,
    BenkTilbakekrevingKolonne
>;
