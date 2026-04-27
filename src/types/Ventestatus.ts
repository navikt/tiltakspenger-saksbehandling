import { Nullable } from './UtilTypes';

export type VentestatusHendelse = {
    sattPåVentAv: string;
    tidspunkt: string;
    begrunnelse: string;
    erSattPåVent: boolean;
    frist: Nullable<string>;
};
