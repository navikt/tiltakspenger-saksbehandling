import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { Nullable } from '~/types/UtilTypes';
import { Tidspunkt } from '~/types/DatoTid';

export type Attestering = {
    status: Attesteringsstatus;
    begrunnelse: SladdbarVerdi<Nullable<string>>;
    endretAv: string;
    endretTidspunkt: Tidspunkt;
};

export enum Attesteringsstatus {
    GODKJENT = 'GODKJENT',
    SENDT_TILBAKE = 'SENDT_TILBAKE',
}
