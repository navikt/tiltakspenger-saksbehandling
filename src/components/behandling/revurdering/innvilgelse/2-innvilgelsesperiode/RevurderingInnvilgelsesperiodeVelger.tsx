import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { BehandlingsperiodeVelger } from '~/components/behandling/felles/behandlingsperiode/BehandlingsperiodeVelger';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';

import style from './RevurderingInnvilgelsesperiodeVelger.module.css';

export const RevurderingInnvilgelsesperiodeVelger = () => {
    const { behandling } = useRevurderingBehandling();

    return (
        <VedtakSeksjon className={style.velger}>
            <VedtakSeksjon.Venstre>
                <BehandlingsperiodeVelger behandling={behandling} label={'Innvilges'} />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
