import { describe, expect, test } from '@jest/globals';
import { BehandlingSkjemaContext } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { tilOppdaterPrioriteringDTO } from '~/lib/rammebehandling/felles/prioritering/prioriteringUtils';
import { Nullable } from '~/types/UtilTypes';

const skjema = (
    erPrioritert: boolean,
    begrunnelse: Nullable<string>,
): Parameters<typeof tilOppdaterPrioriteringDTO>[0] =>
    ({
        erPrioritert,
        textAreas: { prioriteringBegrunnelse: { getValue: () => begrunnelse } },
    }) as unknown as Pick<BehandlingSkjemaContext, 'erPrioritert' | 'textAreas'>;

describe('tilOppdaterPrioriteringDTO', () => {
    test('sender begrunnelsen når behandlingen er prioritert', () => {
        expect(tilOppdaterPrioriteringDTO(skjema(true, 'Bruker står uten inntekt'))).toEqual({
            begrunnelse: 'Bruker står uten inntekt',
        });
    });

    test('sender null når behandlingen ikke er prioritert, selv om begrunnelsen er utfylt', () => {
        expect(tilOppdaterPrioriteringDTO(skjema(false, 'Gammel begrunnelse'))).toBeNull();
    });

    test('sender null når begrunnelsen mangler', () => {
        expect(tilOppdaterPrioriteringDTO(skjema(true, null))).toBeNull();
    });
});
