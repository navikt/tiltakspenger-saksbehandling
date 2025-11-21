import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { InnvilgelsesperiodeVelger } from '~/components/behandling/felles/innvilgelsesperiode/InnvilgelsesperiodeVelger';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';

import style from './RevurderingInnvilgelsesperiodeVelger.module.css';

export const RevurderingInnvilgelsesperiodeVelger = () => {
    const { behandling } = useRevurderingBehandling();

    return (
        <VedtakSeksjon className={style.velger}>
            <VedtakSeksjon.Venstre>
                <InnvilgelsesperiodeVelger behandling={behandling} label={'Innvilges'} />
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
