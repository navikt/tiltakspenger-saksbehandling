import { SladdbarVerdi } from '~/types/SladdetVerdi';

export interface Avbrutt {
    avbruttAv: string;
    avbruttTidspunkt: string;
    begrunnelse: SladdbarVerdi<string>;
}
