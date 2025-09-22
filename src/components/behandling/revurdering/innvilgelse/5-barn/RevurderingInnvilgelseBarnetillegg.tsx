import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';

export const RevurderingInnvilgelseBarnetillegg = () => {
    const { behandling } = useRevurderingBehandling();

    const dispatch = useBehandlingSkjemaDispatch();
    const skjemaContext = useBehandlingSkjema();

    return (
        <BehandlingBarnetillegg
            behandling={behandling}
            dispatch={dispatch}
            context={skjemaContext}
            valgTekst={'Skal det innvilges barnetillegg?'}
        />
    );
};
