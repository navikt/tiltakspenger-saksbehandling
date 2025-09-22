import { BehandlingBarnetillegg } from '~/components/behandling/felles/barnetillegg/BehandlingBarnetillegg';
import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { VedtakBarnetilleggDTO } from '~/types/Barnetillegg';
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
