import { BegrunnelseVilkårsvurdering } from '~/components/behandling/felles/begrunnelse-vilkårsvurdering/BegrunnelseVilkårsvurdering';
import { useRevurderingBehandling } from '~/components/behandling/context/BehandlingContext';
import { useBehandlingSkjema } from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './RevurderingInnvilgelseBegrunnelse.module.css';

export const RevurderingInnvilgelseBegrunnelse = () => {
    const { behandling, rolleForBehandling } = useRevurderingBehandling();
    const { begrunnelse } = useBehandlingSkjema().textAreas;

    return (
        <BegrunnelseVilkårsvurdering
            behandling={behandling}
            rolle={rolleForBehandling}
            tekstRef={begrunnelse.ref}
            className={style.begrunnelse}
        />
    );
};
