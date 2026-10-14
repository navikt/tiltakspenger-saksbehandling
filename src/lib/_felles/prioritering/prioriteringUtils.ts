import { OppdaterPrioriteringDTO } from '~/lib/_felles/prioritering/prioriteringTyper';
import { Nullable } from '~/types/UtilTypes';

// En prioritering uten begrunnelse stoppes av valideringen før lagring, så den sendes aldri til backend.
export const tilOppdaterPrioriteringDTO = (
    erPrioritert: boolean,
    begrunnelse: Nullable<string>,
): Nullable<OppdaterPrioriteringDTO> => {
    if (!erPrioritert) {
        return null;
    }

    return begrunnelse ? { begrunnelse } : null;
};

export const PRIORITERING_MANGLER_BEGRUNNELSE =
    'Begrunnelsen for prioriteringen må være utfylt når behandlingen er prioritert';

// Backend avviser en prioritering uten begrunnelse, så dette må valideres før både lagring og sending til beslutning.
export const prioriteringManglerBegrunnelse = (
    erPrioritert: boolean,
    begrunnelse: Nullable<string>,
): boolean => erPrioritert && !begrunnelse;
