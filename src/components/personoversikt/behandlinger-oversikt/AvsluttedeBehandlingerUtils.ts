import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import {
    BehandlingId,
    RammebehandlingResultat,
    Rammebehandlingstype,
} from '~/types/Rammebehandling';

export type AvbruttBehandlingCellInfo = {
    id: BehandlingId;
    behandlingstype: Rammebehandlingstype;
    resultat: RammebehandlingResultat;
    tidspunktAvsluttet: string;
    behandlingsperiode: Nullable<Periode>;
    avsluttetPga: 'ferdigBehandlet' | 'avbrutt';
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
};
