import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import {
    BenkBehandlingBase,
    BenkBehandlingMedTilgangBase,
    BenkBehandlingstype,
    BenkFellesFilter,
    benkFellesKolonner,
} from './felles';
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

type BenkTilbakekrevingProps = {
    type: BenkBehandlingstype.TILBAKEKREVING;
    id: TilbakekrevingId;
    status: BenkTilbakekrevingStatus;
    beløp: number;
    kilde: BenkTilbakekrevingKilde;
    kravgrunnlagPeriode: Periode;
    /** Lenke til behandlingen i tilbakekrevingsløsningen */
    url: string;
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
};

export type BenkTilbakekreving = BenkBehandlingBase<BenkTilbakekrevingProps>;
export type BenkTilbakekrevingMedTilgang = BenkBehandlingMedTilgangBase<BenkTilbakekrevingProps>;

export const BenkTilbakekrevingKolonne = {
    ...benkFellesKolonner,
    beløp: 'beløp',
    kilde: 'kilde',
    startet: 'startet',
    beslutter: 'beslutter',
    kravgrunnlagPeriode: 'kravgrunnlag_periode',
} as const;

export type BenkTilbakekrevingKolonne =
    (typeof BenkTilbakekrevingKolonne)[keyof typeof BenkTilbakekrevingKolonne];

export type BenkTilbakekrevingFilter = BenkFellesFilter & {
    status: Nullable<BenkTilbakekrevingStatus>;
    kilde: Nullable<BenkTilbakekrevingKilde>;
    kunOverMinstebeløp: boolean;
};
