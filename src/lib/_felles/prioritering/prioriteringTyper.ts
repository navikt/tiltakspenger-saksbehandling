import { SladdbarVerdi } from '~/types/SladdetVerdi';

/** Prioriterte behandlinger ligger alltid øverst i benken. */
export type Prioritering = {
    begrunnelse: SladdbarVerdi<string>;
};

export type OppdaterPrioriteringDTO = {
    begrunnelse: string;
};
