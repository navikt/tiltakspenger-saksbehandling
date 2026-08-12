import { Nullable } from '~/types/UtilTypes';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { BenkBehandlingBase, BenkBehandlingsstatus, BenkBehandlingstype } from './felles';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

export type BenkRevurdering = BenkBehandlingBase & {
    type: BenkBehandlingstype.REVURDERING;
    id: RammebehandlingId;
    status: BenkBehandlingsstatus;
    resultat: Nullable<RevurderingResultat>;
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
};

export enum BenkRevurderingerKolonne {
    fnr = 'fnr',
    resultat = 'resultat',
    status = 'status',
    startet = 'startet',
    sistEndret = 'sist_endret',
    saksbehandler = 'saksbehandler',
    beslutter = 'beslutter',
    ventestatusFrist = 'ventestatus_frist',
}

export type BenkRevurderingerFilter = {
    status: Nullable<BenkBehandlingsstatus>;
    resultat: Nullable<RevurderingResultat>;
    saksbehandler: Nullable<string>;
    skjulPåVent: boolean;
    skjulEgneTilBeslutning: boolean;
};
