import { TextAreaInput } from '~/utils/textarea';

export type BegrunnelseOgBrevInput = {
    textAreas: {
        begrunnelse: TextAreaInput;
        brevtekst: TextAreaInput;
    };
};
