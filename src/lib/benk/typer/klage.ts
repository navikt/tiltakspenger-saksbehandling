import { Nullable } from '~/types/UtilTypes';
import { KlagebehandlingResultat, KlageId } from '~/lib/klage/typer/Klage';
import {
    BenkBehandlingBase,
    BenkBehandlingMedTilgangBase,
    BenkBehandlingsstatus,
    BenkBehandlingstype,
} from './felles';

type BenkKlagebehandlingProps = {
    type: BenkBehandlingstype.KLAGEBEHANDLING;
    id: KlageId;
    status: BenkBehandlingsstatus;
    kravtidspunkt: string;
    resultat: Nullable<KlagebehandlingResultat>;
    beslutter: null;
};

export type BenkKlagebehandling = BenkBehandlingBase<BenkKlagebehandlingProps>;
export type BenkKlagebehandlingMedTilgang = BenkBehandlingMedTilgangBase<BenkKlagebehandlingProps>;

export enum BenkKlageKolonne {
    fnr = 'fnr',
    resultat = 'resultat',
    status = 'status',
    kravtidspunkt = 'kravtidspunkt',
    sistEndret = 'sist_endret',
    saksbehandler = 'saksbehandler',
    ventestatusFrist = 'ventestatus_frist',
}

export type BenkKlageFilter = {
    status: Nullable<BenkBehandlingsstatus>;
    resultat: Nullable<KlagebehandlingResultat>;
    saksbehandler: Nullable<string>;
    skjulPåVent: boolean;
    skjulEgneTilBeslutning: boolean;
};
