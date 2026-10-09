import { getTextAreaRefValue, TextAreaInput } from '~/lib/_felles/fritekst/fritekstUtils';
import { useCallback, useLayoutEffect, useRef } from 'react';
import { SladdbarVerdi } from '~/types/SladdetVerdi';
import { sladdbarTekstEllerNull } from '~/utils/sladdetVerdi';

export const useFritekstInput = (
    lagretVerdi: SladdbarVerdi<string | null> | undefined,
): TextAreaInput => {
    const ref = useRef<HTMLTextAreaElement>(null);

    const getValue = useCallback(
        () => getTextAreaRefValue(ref, sladdbarTekstEllerNull(lagretVerdi)),
        [lagretVerdi],
    );

    // Backend kan endre teksten ved lagring (f.eks. fjerne kontrolltegn som tab), så feltet settes til
    // lagret verdi hver gang vi får ny data fra backend. Layout-effect slik at feltet er oppdatert før
    // andre komponenter (f.eks. dirty-sjekken) leser verdien i sine effects.
    useLayoutEffect(() => {
        const element = ref.current;
        const verdi = sladdbarTekstEllerNull(lagretVerdi) ?? '';

        if (element && element.value !== verdi) {
            element.value = verdi;
        }
    }, [lagretVerdi]);

    return { ref, getValue };
};
