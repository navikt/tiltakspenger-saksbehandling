import { BehandlingSkjemaContext } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { OppdaterPrioriteringDTO } from '~/lib/rammebehandling/typer/Rammebehandling';
import { Nullable } from '~/types/UtilTypes';

// En prioritering uten begrunnelse stoppes av valideringen før lagring, så den sendes aldri til backend.
export const tilOppdaterPrioriteringDTO = (
    skjema: Pick<BehandlingSkjemaContext, 'erPrioritert' | 'textAreas'>,
): Nullable<OppdaterPrioriteringDTO> => {
    if (!skjema.erPrioritert) {
        return null;
    }

    const begrunnelse = skjema.textAreas.prioriteringBegrunnelse.getValue();

    return begrunnelse ? { begrunnelse } : null;
};
