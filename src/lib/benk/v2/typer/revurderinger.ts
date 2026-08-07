import { Nullable } from '~/types/UtilTypes';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { SaksbehandlerBehandlingKommando } from '~/lib/behandling-felles/typer/BehandlingFelles';
import { BenkV2BehandlingBase, BenkV2Behandlingsstatus, BenkV2Request } from './felles';
import { RammebehandlingId } from '~/lib/rammebehandling/typer/Rammebehandling';

export type BenkRevurdering = BenkV2BehandlingBase & {
    id: RammebehandlingId;
    status: BenkV2Behandlingsstatus;
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
}

export type BenkRevurderingerFilter = {
    status: Nullable<BenkV2Behandlingsstatus>;
    resultat: Nullable<RevurderingResultat>;
    saksbehandler: Nullable<string | 'IKKE_TILDELT'>;
    skjulPåVent: boolean;
};

export type BenkRevurderingerRequest = BenkV2Request<
    BenkRevurderingerFilter,
    BenkRevurderingerKolonne
>;
