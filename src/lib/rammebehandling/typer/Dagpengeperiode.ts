import { Dato } from '~/types/DatoTid';
import { Nullable } from '~/types/UtilTypes';

export enum DagpengerYtelsetype {
    ORDINÆRE_DAGPENGER = 'ORDINÆRE_DAGPENGER',
    PERMITTERING = 'PERMITTERING',
    PERMITTERING_FISKEINDUSTRI = 'PERMITTERING_FISKEINDUSTRI',
}

export enum DagpengerKilde {
    ARENA = 'ARENA',
    DP_SAK = 'DP_SAK',
}

export const dagpengerYtelsetypeTekst: Record<DagpengerYtelsetype, string> = {
    [DagpengerYtelsetype.ORDINÆRE_DAGPENGER]: 'Ordinære dagpenger',
    [DagpengerYtelsetype.PERMITTERING]: 'Dagpenger under permittering',
    [DagpengerYtelsetype.PERMITTERING_FISKEINDUSTRI]:
        'Dagpenger under permittering fra fiskeindustrien',
};

export const dagpengerKildeTekst: Record<DagpengerKilde, string> = {
    [DagpengerKilde.ARENA]: 'Arena',
    [DagpengerKilde.DP_SAK]: 'Ny dagpengeløsning',
};

/** `tilOgMed` er null når rettigheten fortsatt er løpende. */
export type Dagpengeperiode = {
    fraOgMed: Dato;
    tilOgMed: Nullable<Dato>;
    ytelsetype: DagpengerYtelsetype;
    kilde: DagpengerKilde;
};
