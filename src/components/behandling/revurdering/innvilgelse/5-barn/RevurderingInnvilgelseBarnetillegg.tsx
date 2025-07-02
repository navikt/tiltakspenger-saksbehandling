import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import {
    useRevurderingInnvilgelseSkjema,
    useRevurderingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';

export const RevurderingInnvilgelseBarnetillegg = () => {
    const { behandling } = useRevurderingBehandling();

    const dispatch = useRevurderingInnvilgelseSkjemaDispatch();
    const skjemaContext = useRevurderingInnvilgelseSkjema();

    return (
        <BehandlingBarnetillegg
            behandling={behandling}
            dispatch={dispatch}
            context={skjemaContext}
            valgTekst={'Ønsker du å behandle barnetillegg?'}
        />
    );
};
