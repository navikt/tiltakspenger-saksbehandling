import { MeldekortbehandlingSeksjon } from '~/lib/meldekort/meldekortbehandling/layout/MeldekortbehandlingSeksjon';
import {
    useMeldekortbehandlingSkjema,
    useMeldekortbehandlingSkjemaDispatch,
} from '~/lib/meldekort/meldekortbehandling/context/MeldekortbehandlingContext';
import { PrioriteringValg } from '~/lib/_felles/prioritering/PrioriteringValg';

export const MeldekortbehandlingPrioritering = () => {
    const { erPrioritert, prioriteringBegrunnelse, erReadonly } = useMeldekortbehandlingSkjema();
    const dispatch = useMeldekortbehandlingSkjemaDispatch();

    return (
        <MeldekortbehandlingSeksjon>
            <MeldekortbehandlingSeksjon.Høyre>
                <PrioriteringValg
                    erPrioritert={erPrioritert}
                    onChange={(valgt) =>
                        dispatch({
                            type: 'setErPrioritert',
                            payload: { erPrioritert: valgt },
                        })
                    }
                    begrunnelse={prioriteringBegrunnelse}
                    readOnly={erReadonly}
                />
            </MeldekortbehandlingSeksjon.Høyre>
        </MeldekortbehandlingSeksjon>
    );
};
