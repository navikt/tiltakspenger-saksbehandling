import { BegrunnelseVilkårsvurdering } from '~/components/behandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import { useRevurderingInnvilgelseSkjema } from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';

import style from './RevurderingInnvilgelseBegrunnelse.module.css';

export const RevurderingInnvilgelseBegrunnelse = () => {
    const { behandling, rolleForBehandling } = useRevurderingBehandling();
    const { begrunnelse } = useRevurderingInnvilgelseSkjema().textAreas;

    return (
        <BegrunnelseVilkårsvurdering
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={begrunnelse.ref}
            className={style.begrunnelse}
        />
    );
};
