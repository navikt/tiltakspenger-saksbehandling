import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { Nullable } from '~/types/UtilTypes';

/** Prioriterte behandlinger ligger alltid øverst i benken. */
export type Prioritering = {
    begrunnelse: SladdbarVerdi<Nullable<string>>;
};

export type OppdaterPrioriteringDTO = {
    begrunnelse: string;
};
