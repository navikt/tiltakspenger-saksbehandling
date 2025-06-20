import { BehandlingTiltak } from '~/components/behandling/felles/tiltak/BehandlingTiltak';
import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import {
    useRevurderingInnvilgelseSkjema,
    useRevurderingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';

export const RevurderingInnvilgelseTiltak = () => {
    const { behandling } = useRevurderingBehandling();
    const dispatch = useRevurderingInnvilgelseSkjemaDispatch();
    const skjemaContext = useRevurderingInnvilgelseSkjema();

    return <BehandlingTiltak behandling={behandling} context={skjemaContext} dispatch={dispatch} />;
};
