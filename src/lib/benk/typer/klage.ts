import { Nullable } from '~/types/UtilTypes';
import { KlagebehandlingResultat, KlageId } from '~/lib/klage/typer/Klage';
import { BenkBehandlingBase, BenkBehandlingsstatus, BenkBehandlingstype } from './felles';

export type BenkKlagebehandling = BenkBehandlingBase & {
    type: BenkBehandlingstype.KLAGEBEHANDLING;
    id: KlageId;
    status: BenkBehandlingsstatus;
    kravtidspunkt: string;
    resultat: Nullable<KlagebehandlingResultat>;
    beslutter: null;
};

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
    saksbehandler: Nullable<string | 'IKKE_TILDELT'>;
    skjulPåVent: boolean;
};
