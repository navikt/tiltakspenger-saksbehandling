import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { useBehandlingSkjema } from '~/lib/rammebehandling/context/BehandlingSkjemaContext';
import { useBehandlingSkjemaFellesDispatch } from '~/lib/rammebehandling/context/felles/behandlingSkjemaFellesContext';
import { PrioriteringValg } from '~/lib/_felles/prioritering/PrioriteringValg';

export const BehandlingPrioritering = () => {
    const { textAreas, erReadonly, erPrioritert } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaFellesDispatch();

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <PrioriteringValg
                    erPrioritert={erPrioritert}
                    onChange={(valgt) =>
                        dispatch({
                            type: 'setErPrioritert',
                            payload: { erPrioritert: valgt },
                        })
                    }
                    begrunnelse={textAreas.prioriteringBegrunnelse}
                    readOnly={erReadonly}
                />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
