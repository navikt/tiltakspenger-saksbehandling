import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import {
    useRevurderingInnvilgelseSkjema,
    useRevurderingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';
import { BehandlingsperiodeVelger } from '~/components/behandling/felles/behandlingsperiode/BehandlingsperiodeVelger';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';

import style from './RevurderingInnvilgelsesperiodeVelger.module.css';

export const RevurderingInnvilgelsesperiodeVelger = () => {
    const { behandling } = useRevurderingBehandling();
    const skjemaContext = useRevurderingInnvilgelseSkjema();
    const dispatch = useRevurderingInnvilgelseSkjemaDispatch();

    return (
        <VedtakSeksjon className={style.velger}>
            <VedtakSeksjon.Venstre>
                <BehandlingsperiodeVelger
                    behandling={behandling}
                    dispatch={dispatch}
                    context={skjemaContext}
                    label={'Innvilges'}
                />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
