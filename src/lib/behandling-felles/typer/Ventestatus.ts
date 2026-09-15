import { Nullable } from '~/types/UtilTypes';
import { SladdbarVerdi } from '~/types/SladdetVerdi';

export type VentestatusHendelse = {
    sattPåVentAv: string;
    tidspunkt: string;
    begrunnelse: SladdbarVerdi<string>;
    erSattPåVent: boolean;
    frist: Nullable<string>;
    status: string;
};
