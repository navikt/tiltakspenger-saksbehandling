import { Nullable } from '~/types/UtilTypes';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { BenkV2BehandlingBase, BenkV2Behandlingsstatus, BenkV2Request } from './felles';

export type BenkRevurdering = BenkV2BehandlingBase & {
    status: BenkV2Behandlingsstatus;
    resultat: Nullable<RevurderingResultat>;
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
};

export type BenkRevurderingerRequest = BenkV2Request<
    BenkRevurderingerFilter,
    BenkRevurderingerKolonne
>;
