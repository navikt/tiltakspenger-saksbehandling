import { Checkbox } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { FritekstInput } from '~/lib/_felles/fritekst/FritekstInput';
import { useBehandlingSkjema } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';

export const BehandlingPrioritering = () => {
    const { textAreas, erReadonly, prioritering } = useBehandlingSkjema();
    const { prioriteringBegrunnelse } = textAreas;

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre gap={'space-8'}>
                <Checkbox
                    size={'small'}
                    checked={prioritering.erPrioritert}
                    readOnly={erReadonly}
                    onChange={(e) => prioritering.setErPrioritert(e.target.checked)}
                    description={
                        'Kun for hastesaker. Disse vises alltid øverst i behandlingsoversikten.'
                    }
                >
                    {'Prioritert behandling'}
                </Checkbox>
                {prioritering.erPrioritert && (
                    <FritekstInput
                        label={'Begrunnelse for prioritering'}
                        hideLabel={false}
                        size={'small'}
                        minRows={2}
                        defaultValue={prioriteringBegrunnelse.getValue() ?? ''}
                        readOnly={erReadonly}
                        ref={prioriteringBegrunnelse.ref}
                    />
                )}
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
