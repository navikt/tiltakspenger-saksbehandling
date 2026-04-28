import { Nullable } from '~/types/UtilTypes';
import { Periode } from '~/types/Periode';
import {
    RammebehandlingResultat,
    Rammebehandlingstype,
} from '~/lib/rammebehandling/typer/Rammebehandling';
import { KlagebehandlingResultat } from '~/lib/klage/typer/Klage';

export type AvbruttBehandlingCellInfo = {
    id: string;
    behandlingstype: AvbruttBehandlingstype;
    resultat: AvbruttBehandlingResultat;
    tidspunktAvsluttet: string;
    behandlingsperiode: Nullable<Periode>;
    avsluttetPga: 'ferdigBehandlet' | 'avbrutt';
    saksbehandler?: Nullable<string>;
    beslutter?: Nullable<string>;
};

export type AvbruttBehandlingstype = Rammebehandlingstype | 'KLAGEBEHANDLING';
export type AvbruttBehandlingResultat = RammebehandlingResultat | KlagebehandlingResultat;

export const avbruttbehandlingstypeTekst: Record<AvbruttBehandlingstype, string> = {
    [Rammebehandlingstype.SØKNADSBEHANDLING]: 'Søknadsbehandling',
    [Rammebehandlingstype.REVURDERING]: 'Revurdering',
    KLAGEBEHANDLING: 'Klagebehandling',
};
