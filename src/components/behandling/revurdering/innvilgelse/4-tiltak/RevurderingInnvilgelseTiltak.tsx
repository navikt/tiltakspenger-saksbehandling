import { BehandlingTiltak } from '~/components/behandling/felles/tiltak/BehandlingTiltak';
import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';

export const RevurderingInnvilgelseTiltak = () => {
    const { behandling } = useRevurderingBehandling();
    const dispatch = useBehandlingSkjemaDispatch();
    const skjemaContext = useBehandlingSkjema();

    return <BehandlingTiltak behandling={behandling} context={skjemaContext} dispatch={dispatch} />;
};
