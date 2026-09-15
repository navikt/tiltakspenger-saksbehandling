import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { Nullable } from '~/types/UtilTypes';

export type Attestering = {
    status: Attesteringsstatus;
    begrunnelse: SladdbarVerdi<Nullable<string>>;
    endretAv: string;
    endretTidspunkt: string;
};

export enum Attesteringsstatus {
    GODKJENT = 'GODKJENT',
    SENDT_TILBAKE = 'SENDT_TILBAKE',
}
