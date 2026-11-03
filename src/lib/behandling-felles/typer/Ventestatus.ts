import { Nullable } from '~/types/UtilTypes';
import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { Dato, Tidspunkt } from '~/types/DatoTid';

export type VentestatusHendelse = {
    sattPåVentAv: string;
    tidspunkt: Tidspunkt;
    begrunnelse: SladdbarVerdi<string>;
    erSattPåVent: boolean;
    frist: Nullable<Dato>;
    status: string;
};
