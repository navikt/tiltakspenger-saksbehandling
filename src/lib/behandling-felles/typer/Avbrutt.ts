import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { Tidspunkt } from '~/types/DatoTid';

export interface Avbrutt {
    avbruttAv: string;
    avbruttTidspunkt: Tidspunkt;
    begrunnelse: SladdbarVerdi<string>;
}
