import { Dato } from '~/types/DatoTid';
import { Nullable } from '~/types/UtilTypes';

/** `tilOgMed` er null når rettigheten fortsatt er løpende. */
export type Dagpengeperiode = {
    fraOgMed: Dato;
    tilOgMed: Nullable<Dato>;
    ytelsetype: string;
    kilde: string;
};
