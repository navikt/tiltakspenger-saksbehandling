import { Nullable } from '~/types/UtilTypes';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import {
    BenkBehandlingBase,
    BenkBehandlingMedTilgangBase,
    BenkBehandlingsstatus,
    BenkBehandlingstype,
    BenkFellesFilter,
    benkFellesKolonner,
} from './felles';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

type BenkRevurderingProps = {
    type: BenkBehandlingstype.REVURDERING;
    id: RammebehandlingId;
    status: BenkBehandlingsstatus;
    resultat: Nullable<RevurderingResultat>;
    gyldigeKommandoer: SaksbehandlerBehandlingKommando[];
};

export type BenkRevurdering = BenkBehandlingBase<BenkRevurderingProps>;
export type BenkRevurderingMedTilgang = BenkBehandlingMedTilgangBase<BenkRevurderingProps>;

export const BenkRevurderingerKolonne = {
    ...benkFellesKolonner,
    resultat: 'resultat',
    startet: 'startet',
    beslutter: 'beslutter',
} as const;

export type BenkRevurderingerKolonne =
    (typeof BenkRevurderingerKolonne)[keyof typeof BenkRevurderingerKolonne];

export type BenkRevurderingerFilter = BenkFellesFilter & {
    status: Nullable<BenkBehandlingsstatus>;
    resultat: Nullable<RevurderingResultat>;
};
