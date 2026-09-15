import { Periode } from '../../../types/Periode';
import { Nullable } from '../../../types/UtilTypes';
import { SladdbarVerdi } from '~/types/SladdetVerdi';

export type BarnetilleggPeriode = {
    antallBarn: number;
    periode: Periode;
};

export type Barnetillegg = {
    perioder: BarnetilleggPeriode[];
    begrunnelse: SladdbarVerdi<Nullable<string>>;
};

/** Sendes til backenden, og har derfor aldri sladdede verdier. */
export type BarnetilleggDTO = {
    perioder: BarnetilleggPeriode[];
    begrunnelse: Nullable<string>;
};
