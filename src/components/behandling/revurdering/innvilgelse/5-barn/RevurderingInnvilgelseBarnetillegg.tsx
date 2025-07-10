import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import {
    useRevurderingInnvilgelseSkjema,
    useRevurderingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';
import { VedtakBarnetilleggDTO } from '~/types/Barnetillegg';

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
            lagring={{
                url: `/sak/${behandling.sakId}/behandling/${behandling.id}/barnetillegg`,
                body: (tekst) =>
                    ({
                        begrunnelse: tekst,
                        perioder: skjemaContext.barnetilleggPerioder ?? [],
                    }) satisfies VedtakBarnetilleggDTO,
            }}
        />
    );
};
